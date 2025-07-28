import { and, asc, desc, eq, getTableColumns, sql } from "drizzle-orm";
import type DBClient from "@nimbly/db";
import { schemas } from "@nimbly/db";
import type { FindManyByClient } from "@/tickets/application/dtos/find.dto";
import type {
	TicketDetail,
	TicketSummary,
} from "@/tickets/domain/entities/ticket.entity";
import type { TicketsQueriesRepository } from "@/tickets/domain/repositories/tickets-queries.repository";
import { verifyTicketItemDto } from "../mappers/tickets-items.mapper";

const tickets = schemas.tables.tickets;
const ticketItems = schemas.tables.ticketItems;

export class TicketsQueriesRepositoryImpl implements TicketsQueriesRepository {
	constructor(private readonly db: DBClient["client"]) {}

	public async findManyByClient(
		meta: FindManyByClient,
	): Promise<TicketDetail[]> {
		const { clientId } = meta;

		const data = await this.db
			.select({
				...getTableColumns(tickets),
				items: sql<string>`json_group_array(
                json_object (
                  'isActive', ${ticketItems.isActive},
                  'createdAt', ${ticketItems.createdAt},
                  'updatedAt', ${ticketItems.updatedAt},
                  'deletedAt', ${ticketItems.deletedAt},
                  'id', ${ticketItems.id},
                  'productId', ${ticketItems.productId},
                  'ticketId', ${ticketItems.ticketId},
                  'description', ${ticketItems.description},
                  'price', ${ticketItems.price},
                  'quantity', ${ticketItems.quantity},
                  'subtotal', ${ticketItems.subtotal}
                )
            )`,
			})
			.from(tickets)
			.innerJoin(ticketItems, eq(tickets.id, ticketItems.ticketId))
			.where(and(eq(tickets.clientId, clientId), eq(tickets.isActive, true)))
			.groupBy(tickets.id)
			.orderBy(desc(tickets.createdAt));

		return data.map((d) => {
			const { success, data, error } = verifyTicketItemDto(d.items);

			if (!success || !data || !data.length) {
				throw new Error(error?.message, {
					cause: "INTERNAL_SERVER_ERROR",
				});
			}

			return {
				...d,
				items: data,
			};
		});
	}

	public findManySummaryByClient(clientId: string): Promise<TicketSummary[]> {
		return this.db
			.select()
			.from(tickets)
			.where(and(eq(tickets.clientId, clientId), eq(tickets.isActive, true)))
			.orderBy(asc(tickets.createdAt));
	}

	public async findOneTicket(
		ticketId: number,
		clientId: string,
	): Promise<TicketDetail | null> {
		const [ticket] = await this.db
			.select({
				...getTableColumns(tickets),
				items: sql<string>`json_group_array(
                json_object (
                  'isActive', ${ticketItems.isActive},
                  'createdAt', ${ticketItems.createdAt},
                  'updatedAt', ${ticketItems.updatedAt},
                  'deletedAt', ${ticketItems.deletedAt},
                  'id', ${ticketItems.id},
                  'productId', ${ticketItems.productId},
                  'ticketId', ${ticketItems.ticketId},
                  'description', ${ticketItems.description},
                  'price', ${ticketItems.price},
                  'quantity', ${ticketItems.quantity},
                  'subtotal', ${ticketItems.subtotal}
                )
            )`,
			})
			.from(tickets)
			.where(
				and(
					eq(tickets.id, ticketId),
					eq(tickets.clientId, clientId),
					eq(tickets.isActive, true),
				),
			);

		if (!ticket || !ticket.id) {
			return null;
		}

		const { success, data, error } = verifyTicketItemDto(ticket.items);

		if (!success || !data || !data.length) {
			throw new Error(error?.message, {
				cause: "INTERNAL_SERVER_ERROR",
			});
		}

		return {
			...ticket,
			items: data,
		};
	}
}
