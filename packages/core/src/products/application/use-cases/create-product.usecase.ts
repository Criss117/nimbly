import type { ProductsCommandsRepository } from "@/products/domain/repositories/products-commands.repository";
import type { CreateProductDto } from "../dtos/create-product.dto";

export class CreateProductUseCase {
	constructor(
		private readonly productsCommandsRepository: ProductsCommandsRepository,
	) {}

	public execute(data: CreateProductDto) {
		return this.productsCommandsRepository.createProduct(data);
	}
}
