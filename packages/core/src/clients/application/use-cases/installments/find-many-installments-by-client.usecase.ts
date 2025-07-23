import type { InstallmentsQueriesRepository } from "@/clients/domain/repositories/installments-queries.repository";
import type { FindManyInstallmentsDto } from "@/clients/application/dtos/find-many-installments.dto";
import { calculateNextCursor } from "@/shared/utils/next-cursor";

export class FindManyInstallmentsByClientUseCase {
	constructor(
		private readonly installmentsQueriesRepository: InstallmentsQueriesRepository,
	) {}

	public async execute(meta: FindManyInstallmentsDto) {
		const data = await this.installmentsQueriesRepository.findAllBy(meta);

		const { hasMore, items, lastItem } = calculateNextCursor(data, meta.limit);

		const nextCursor: FindManyInstallmentsDto["cursor"] = {
			lastId: hasMore ? lastItem.id : null,
			createdAt: hasMore ? lastItem.createdAt : null,
		};

		return {
			items,
			nextCursor,
		};
	}
}
