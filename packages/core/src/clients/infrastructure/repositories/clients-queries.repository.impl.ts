import {
	and,
	count,
	desc,
	eq,
	getTableColumns,
	like,
	lte,
	max,
	or,
	sql,
	type SQL,
} from "drizzle-orm";
import type { ClientsQueriesRepository } from "@/clients/domain/repositories/clients-queries.repository";
import type { FindManyClientsDto } from "@/clients/application/dtos/find-many-clients.dto";
import type { FindOneClientByDto } from "@/clients/application/dtos/find-one-client.dto";
import type {
	ClientDetail,
	ClientSummary,
} from "@/clients/domain/entities/client.entity";
import type { ClientId } from "@/shared/value-objects/client.value-object";
import type DBClient from "@nimbly/db";
import { schemas, type TX } from "@nimbly/db";

const clients = schemas.tables.clients;
const tickets = schemas.tables.tickets;
const installmentPlans = schemas.tables.installmentPlans;

export class ClientsQueriesRepositoryImpl implements ClientsQueriesRepository {
	constructor(private readonly db: DBClient["client"]) {}

	public async findOne(
		meta: FindOneClientByDto,
		tx?: TX,
	): Promise<ClientDetail> {
		const [client] = await this.db
			.select({
				...getTableColumns(clients),
				totalTickets: count(tickets.id),
				totalTicketsUnpaid: sql<number>`SUM(CASE WHEN ${tickets.status} = 'unpaid' OR ${tickets.status} = 'partial' THEN 1 ELSE 0 END)`,
				totalTicketsPaid: sql<number>`SUM(CASE WHEN ${tickets.status} = 'paid' THEN 1 ELSE 0 END)`,
				totalDebt: sql<number>`
          (SELECT SUM(${installmentPlans.total} - ${installmentPlans.totalPaid})
          FROM ${installmentPlans}
          WHERE (${clients.id} = ${installmentPlans.clientId})
          AND ${installmentPlans.status} != 'paid'
          AND ${installmentPlans.isActive} = true)
        `,
				totalInstallments: sql<number>`
          (SELECT COUNT(${installmentPlans.id})
          FROM ${installmentPlans}
          WHERE ${clients.id} = ${installmentPlans.clientId})
        `,
				lastTicketDate: max(tickets.createdAt),
			})
			.from(clients)
			.leftJoin(tickets, eq(clients.id, tickets.clientId))
			.where(
				and(
					meta.clientId ? eq(clients.id, meta.clientId) : sql`true`,
					meta.clientCode ? eq(clients.clientCode, meta.clientCode) : sql`true`,
				),
			);

		if (!client.id) return null;

		return { ...client, totalDebt: client.totalDebt || 0 };
	}

	public findMany(meta: FindManyClientsDto, tx?: TX): Promise<ClientSummary[]> {
		const db = tx ?? this.db;
		const { limit, searchQuery } = meta;

		const cursorFilters: SQL[] = [];
		const searchFilters: SQL[] = [];

		meta.cursor &&
			cursorFilters.push(
				or(
					lte(clients.createdAt, meta.cursor.createdAt),
					and(
						eq(clients.createdAt, meta.cursor.createdAt),
						lte(clients.clientCode, meta.cursor.lastClientCode),
					),
				),
			);

		searchQuery &&
			searchFilters.push(
				or(
					like(clients.fullName, `%${searchQuery}%`),
					like(clients.clientCode, `%${searchQuery}%`),
				),
			);

		return db
			.select()
			.from(clients)
			.where(
				and(...cursorFilters, ...searchFilters, eq(clients.isActive, true)),
			)
			.orderBy(desc(clients.createdAt))
			.limit(limit + 1);
	}

	public async findOneSummary(
		clientId: ClientId,
		tx?: TX,
	): Promise<ClientSummary> {
		const db = tx ?? this.db;

		const [client] = await db
			.select()
			.from(clients)
			.where(eq(clients.id, clientId));

		if (!client || !client.id) {
			return null;
		}

		return client;
	}
}
