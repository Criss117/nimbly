import type { TicketsQueriesRepository } from "@/tickets/domain/repositories/tickets-queries.repository";
import type { TX } from "@nimbly/db";
import type { UpdateTotalPaidDto } from "../dtos/update-ticket.dto";
import type { TicketsCommandsRepository } from "@/tickets/domain/repositories/tickets-commands.repository";

export class IncreaseTicketTotalUseCase {
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

		let amountToAssign = amount;
		const ticketsToUpdate: UpdateTotalPaidDto[] = [];

		for (const ticket of tickets) {
			if (amountToAssign === 0) break;

			const balanceDue = ticket.total - ticket.totalPaid;
			const toPay = Math.min(balanceDue, amountToAssign);

			ticket.totalPaid += toPay;
			amountToAssign -= toPay;

			// Actualizar estado
			if (ticket.totalPaid === ticket.total) {
				ticket.status = "paid";
			} else if (ticket.totalPaid > 0) {
				ticket.status = "partial";
			}

			ticketsToUpdate.push({
				id: ticket.id,
				totalPaid: ticket.totalPaid,
				status: ticket.status,
			});
		}

		if (ticketsToUpdate.length < 0) {
			throw new Error("No hay tickets para actualizar", {
				cause: "NOT_FOUND",
			});
		}

		return this.ticketsCommandsRepository.updateTotalPaid(ticketsToUpdate, tx);
	}
}
