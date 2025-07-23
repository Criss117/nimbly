import { and, eq } from "drizzle-orm";
import type DBClient from "@nimbly/db";
import { schemas, type TX } from "@nimbly/db";
import type { ClientsCommandsRepository } from "@/clients/domain/repositories/clients-commands.repository";
import type { CreateClientDto } from "@/clients/application/dtos/create-client.dto";
import type { UpdateClientDto } from "@/clients/application/dtos/update-client.dto";
import type { ClientSummary } from "@/clients/domain/entities/client.entity";

const clients = schemas.tables.clients;

export class ClientsCommandsRepositoryImpl
	implements ClientsCommandsRepository
{
	constructor(private readonly db: DBClient["client"]) {}

	async createClient(data: CreateClientDto, tx?: TX): Promise<ClientSummary> {
		const db = tx ?? this.db;

		const [createdClient] = await db.insert(clients).values(data).returning();

		return createdClient;
	}

	async updateClient(data: UpdateClientDto, tx?: TX): Promise<ClientSummary> {
		const db = tx ?? this.db;
		const { clientId, ...rest } = data;

		const filteredRest = Object.fromEntries(
			Object.entries(rest).filter(([_, v]) => v !== undefined),
		);

		const [updatedClient] = await db
			.update(clients)
			.set({
				...filteredRest,
				updatedAt: new Date(),
			})
			.where(and(eq(clients.id, clientId), eq(clients.isActive, true)))
			.returning();

		return updatedClient;
	}
}
