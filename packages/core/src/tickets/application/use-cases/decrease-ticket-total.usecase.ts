import type { TicketsQueriesRepository } from "@/tickets/domain/repositories/tickets-queries.repository";
import type { TX } from "@nimbly/db";
import type { UpdateTotalPaidDto } from "../dtos/update-ticket.dto";
import type { TicketsCommandsRepository } from "@/tickets/domain/repositories/tickets-commands.repository";

export class DecreaseTicketTotalUseCase {
	constructor(
		private readonly ticketsQueriesRepository: TicketsQueriesRepository,
		private readonly ticketsCommandsRepository: TicketsCommandsRepository,
	) {}

	public async execute(clientId: string, amount: number, tx?: TX) {
		if (amount <= 0) {
			throw new Error("El monto debe ser mayor a 0", {
				cause: "BAD_REQUEST",
			});
		}

		const tickets =
			await this.ticketsQueriesRepository.findManySummaryByClient(clientId);

		if (tickets.length === 0) {
			throw new Error("No hay tickets para actualizar", {
				cause: "NOT_FOUND",
			});
		}

		let amountToReduce = amount;
		const ticketsToUpdate: UpdateTotalPaidDto[] = [];

		// Recorrer en orden inverso para deshacer pagos desde los más recientes
		for (let i = tickets.length - 1; i >= 0 && amountToReduce > 0; i--) {
			const ticket = tickets[i];

			// Solo procesar tickets que tengan totalPaid > 0
			if (ticket.totalPaid > 0) {
				const amountToSubtract = Math.min(ticket.totalPaid, amountToReduce);

				ticket.totalPaid -= amountToSubtract;
				amountToReduce -= amountToSubtract;

				// Actualizar estado
				if (ticket.totalPaid === 0) {
					ticket.status = "unpaid";
				} else if (ticket.totalPaid < ticket.total) {
					ticket.status = "partial";
				} else {
					ticket.status = "paid";
				}

				ticketsToUpdate.push({
					id: ticket.id,
					totalPaid: ticket.totalPaid,
					status: ticket.status,
				});
			}
		}

		if (ticketsToUpdate.length > 0) {
			await this.ticketsCommandsRepository.updateTotalPaid(ticketsToUpdate, tx);
		}
	}
}
