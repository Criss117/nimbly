import type { FindManyByClient } from "@/tickets/application/dtos/find.dto";
import type { TicketDetail, TicketSummary } from "../entities/ticket.entity";

export interface TicketsQueriesRepository {
	findManyByClient(meta: FindManyByClient): Promise<TicketDetail[]>;
	findManySummaryByClient(clientId: string): Promise<TicketSummary[]>;
	findOneTicket(ticketId: number, clientId: string): Promise<TicketSummary>;
}
