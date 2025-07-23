import { calculateNextCursor } from "@/shared/utils/next-cursor";
import type { Paginated } from "@/shared/value-objects/cursor.value-object";
import type { FindManyClientsDto } from "@/clients/application/dtos/find-many-clients.dto";
import type { ClientSummary } from "@/clients/domain";
import type { ClientsQueriesRepository } from "@/clients/domain/repositories/clients-queries.repository";

export class FindManyClientsUseCase {
	constructor(
		private readonly clientsQueriesRepository: ClientsQueriesRepository,
	) {}

	public async execute(
		meta: FindManyClientsDto,
	): Promise<Paginated<ClientSummary, FindManyClientsDto["cursor"]>> {
		const data = await this.clientsQueriesRepository.findMany(meta);

		const { hasMore, items, lastItem } = calculateNextCursor(data, meta.limit);

		const nextCursor: FindManyClientsDto["cursor"] = {
			lastClientCode: hasMore ? lastItem.clientCode : null,
			createdAt: hasMore ? lastItem.createdAt : null,
		};

		return {
			items,
			nextCursor,
		};
	}
}
