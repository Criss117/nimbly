import type { ProductsQueriesRepository } from "@/products/domain";

export class FindManyLastUpdatedProductsUseCase {
	constructor(
		private readonly productsQueriesRepository: ProductsQueriesRepository,
	) {}

	public execute(lastUpdatedAt: Date) {
		return this.productsQueriesRepository.findManyLastProductsUpdated(
			lastUpdatedAt,
		);
	}
}
