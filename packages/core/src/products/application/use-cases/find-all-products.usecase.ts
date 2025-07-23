import type { ProductsQueriesRepository } from "../../domain/repositories/products-queries.repository";

export class FindAllProductsUseCase {
	constructor(
		private readonly productsQueriesRepository: ProductsQueriesRepository,
	) {}

	async execute() {
		return this.productsQueriesRepository.findAll();
	}
}
