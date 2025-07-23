import { calculateNextCursor } from "@/shared/utils/next-cursor";
import type {
	ProductDetail,
	ProductsQueriesRepository,
} from "@/products/domain";
import type { FindManyProductsDto } from "../dtos/find-many-products.dto";
import type {
	BaseCursorDto,
	Paginated,
} from "@/shared/value-objects/cursor.value-object";

export class FindManyProductsUseCase {
	constructor(
		private readonly productQueriesRepository: ProductsQueriesRepository,
	) {}

	public async execute(
		meta: FindManyProductsDto,
	): Promise<Paginated<ProductDetail, BaseCursorDto>> {
		const data = await this.productQueriesRepository.findMany(meta);

		const { hasMore, items, lastItem } = calculateNextCursor(data, meta.limit);

		const nextCursor: BaseCursorDto = {
			lastId: lastItem.id,
			createdAt: lastItem.createdAt,
		};

		return {
			items,
			nextCursor: hasMore ? nextCursor : undefined,
		};
	}
}
