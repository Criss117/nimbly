import type { ProductsQueriesRepository } from "@/products/domain";
import type { FindOneProductByDto } from "../dtos/find.dto";

export class FindOneProductByUseCase {
	constructor(
		private readonly productsQueriesRepository: ProductsQueriesRepository,
	) {}

	public async execute(meta: FindOneProductByDto) {
		return this.productsQueriesRepository.findOneBy(meta);
	}
}
