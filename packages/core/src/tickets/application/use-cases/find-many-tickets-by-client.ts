import type { TicketsQueriesRepository } from "@/tickets/domain/repositories/tickets-queries.repository";

export class FindManyTicketsByClientUseCase {
	constructor(
		private readonly ticketsQueriesRepository: TicketsQueriesRepository,
	) {}

	public async execute(clientId: string) {
		return this.ticketsQueriesRepository.findManyByClient({
			clientId,
		});
	}
}
