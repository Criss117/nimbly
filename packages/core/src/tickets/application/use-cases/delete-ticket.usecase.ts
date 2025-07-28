import type { TicketsCommandsRepository } from "@/tickets/domain/repositories/tickets-commands.repository";
import type { TicketsQueriesRepository } from "@/tickets/domain/repositories/tickets-queries.repository";
import type { DeleteTicketDto } from "../dtos/delete-ticket.dto";
import type { ReduceInstallmentTotalUseCase } from "@/clients";
import type DBClient from "@nimbly/db";

export class DeleteTicketUseCase {
	constructor(
		private readonly ticketsQueriesRepository: TicketsQueriesRepository,
		private readonly ticketsCommandsRepository: TicketsCommandsRepository,
		private readonly reduceInstallmentTotalUseCase: ReduceInstallmentTotalUseCase,
		private readonly dbClient: DBClient,
	) {}

	public async execute({ ticketId, clientId }: DeleteTicketDto) {
		const ticket = await this.ticketsQueriesRepository.findOneTicket(
			ticketId,
			clientId,
		);

		if (!ticket) {
			throw new Error("No se encontró el ticket", {
				cause: "NOT_FOUND",
			});
		}

		return this.dbClient.transaction(async (tx) => {
			const deleteTicketPromise = this.ticketsCommandsRepository.deleteTicket(
				ticketId,
				clientId,
				tx,
			);

			const reducePaysPromises = this.reduceInstallmentTotalUseCase.execute(
				clientId,
				ticket.total,
				tx,
			);

			return Promise.all([deleteTicketPromise, reducePaysPromises]);
		});
	}
}
