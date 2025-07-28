import type { ClientId } from "@/shared/value-objects/client.value-object";
import type { CreateTicketDto } from "@/tickets/application/dtos/create-ticket.dto";
import type { ReturnFromTicketDto } from "@/tickets/application/dtos/return-from-ticket.dto";
import type { UpdateTotalPaidDto } from "@/tickets/application/dtos/update-ticket.dto";
import type { TX } from "@nimbly/db";

export interface TicketsCommandsRepository {
	createTicket(data: CreateTicketDto, tx?: TX): Promise<void>;
	deleteTicketItems(data: ReturnFromTicketDto, tx?: TX): Promise<void>;
	updateTotalPaid(data: UpdateTotalPaidDto[], tx?: TX): Promise<void>;
	deleteTicket(ticketId: number, clientId: ClientId, tx?: TX): Promise<void>;
}
