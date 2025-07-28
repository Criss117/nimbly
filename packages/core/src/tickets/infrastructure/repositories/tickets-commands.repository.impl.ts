import { and, eq, inArray, sql } from "drizzle-orm";
import { schemas, type TX } from "@nimbly/db";
import type DBClient from "@nimbly/db";

import type { ClientId } from "@/shared/value-objects/client.value-object";
import type { CreateTicketDto } from "@/tickets/application/dtos/create-ticket.dto";
import type { UpdateTotalPaidDto } from "@/tickets/application/dtos/update-ticket.dto";
import type { TicketsCommandsRepository } from "@/tickets/domain/repositories/tickets-commands.repository";
import type { ReturnFromTicketDto } from "@/tickets/application/dtos/return-from-ticket.dto";

const tickets = schemas.tables.tickets;
const ticketItems = schemas.tables.ticketItems;

export class TicketsCommandsRepositoryImpl
	implements TicketsCommandsRepository
{
	constructor(private readonly db: DBClient["client"]) {}

	public async createTicket(data: CreateTicketDto, tx?: TX): Promise<void> {
		const db = tx ?? this.db;

		const { items, ...ticket } = data;
		const isCredit = ticket.payType === "credit";
		const total = items.reduce((acc, t) => acc + t.price * t.quantity, 0);

		await db.transaction(async (tx) => {
			const [{ id: ticketId }] = await tx
				.insert(tickets)
				.values({
					total,
					status: isCredit ? "unpaid" : "paid",
					clientId: isCredit ? ticket.clientId : null,
				})
				.returning({
					id: tickets.id,
				});

			const insertItems = items.map((i) => ({
				...i,
				ticketId,
				subtotal: i.price * i.quantity,
			}));

			await tx.insert(ticketItems).values(insertItems);

			return ticketId;
		});
	}

	public async updateTotalPaid(
		data: UpdateTotalPaidDto[],
		tx?: TX,
	): Promise<void> {
		const db = tx ?? this.db;

		const updateTicketsPromises = data.map(async (d) =>
			db
				.update(tickets)
				.set({
					status: d.status,
					totalPaid: d.totalPaid,
					updatedAt: new Date(),
				})
				.where(eq(tickets.id, d.id)),
		);

		await Promise.all(updateTicketsPromises);
	}

	public async deleteTicket(
		ticketId: number,
		clientId: ClientId,
		tx?: TX,
	): Promise<void> {
		const db = tx ?? this.db;

		await db
			.update(tickets)
			.set({
				isActive: false,
				deletedAt: new Date(),
			})
			.where(
				and(
					eq(tickets.id, ticketId),
					eq(tickets.isActive, true),
					eq(tickets.clientId, clientId),
				),
			);
	}

	public async deleteTicketItems(
		data: ReturnFromTicketDto,
		tx?: TX,
	): Promise<void> {
		const db = tx ?? this.db;

		const itemsDeleted = await db
			.delete(ticketItems)
			.where(
				and(
					eq(ticketItems.ticketId, data.ticketId),
					inArray(ticketItems.id, data.ticketItemIds),
				),
			)
			.returning({
				subtotal: ticketItems.subtotal,
			});

		const totalToReturn = itemsDeleted.reduce((acc, i) => acc + i.subtotal, 0);

		await db
			.update(tickets)
			.set({
				total: sql<number>`${tickets.total} - ${totalToReturn}`,
			})
			.where(eq(tickets.id, data.ticketId));
	}
}
