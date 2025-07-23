import type { ProductsCommandsRepository } from "@/products/domain/repositories/products-commands.repository";

export class DeleteProductUseCase {
	constructor(
		private readonly productsCommandsRepository: ProductsCommandsRepository,
	) {}

	public async execute(productId: number) {
		return this.productsCommandsRepository.deleteProduct(productId);
	}
}
