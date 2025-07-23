import { calculateNextCursor } from "@/shared/utils/next-cursor";
import type { CategoriesQueriesRepository } from "@/products/domain/repositories/categories-queries.repository";
import type { FindManyCategoriesDto } from "../dtos/find-many-categories.dto";
import type { BaseCursorDto } from "@/shared/value-objects/cursor.value-object";

export class FindManyCategoriesUseCase {
	constructor(
		private readonly categoriesQueriesRepository: CategoriesQueriesRepository,
	) {}

	public async execute(meta: FindManyCategoriesDto) {
		const data = await this.categoriesQueriesRepository.findMany(meta);

		const { hasMore, items, lastItem } = calculateNextCursor(data, meta.limit);
		const nextCursor: BaseCursorDto = {
			lastId: hasMore ? lastItem.id : null,
			createdAt: hasMore ? lastItem.createdAt : null,
		};

		return {
			items,
			nextCursor,
		};
	}
}
