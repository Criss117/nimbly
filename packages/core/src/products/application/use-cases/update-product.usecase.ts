import type { ProductsQueriesRepository } from "@/products/domain";
import type { CategoriesQueriesRepository } from "@/products/domain/repositories/categories-queries.repository";
import type { ProductsCommandsRepository } from "@/products/domain/repositories/products-commands.repository";
import type { UpdateProductDto } from "../dtos/update-product.dto";

export class UpdateProductUseCase {
	constructor(
		private readonly productsQueriesRepository: ProductsQueriesRepository,
		private readonly productsCommandsRepository: ProductsCommandsRepository,
		private readonly categoriesQueriesRepository: CategoriesQueriesRepository,
	) {}

	public async execute(productId: number, data: UpdateProductDto) {
		const currentProduct = await this.productsQueriesRepository.findOneBy({
			productId,
		});

		if (!currentProduct) {
			throw new Error("El producto no existe", {
				cause: "BAD_REQUEST",
			});
		}

		if (data.barcode !== currentProduct.barcode) {
			const existsBarcode = await this.productsQueriesRepository.findOneBy({
				barcode: data.barcode,
			});

			if (existsBarcode) {
				throw new Error("El código de barras ya esta siendo utilizado", {
					cause: "BAD_REQUEST",
				});
			}
		}

		if (data.categoryId && data.categoryId !== currentProduct.categoryId) {
			const existingCategory = await this.categoriesQueriesRepository.findOneBy(
				{
					categoryId: data.categoryId,
				},
			);

			if (!existingCategory) {
				throw new Error("La categoría no existe", {
					cause: "NOT_FOUND",
				});
			}
		}

		return this.productsCommandsRepository.updateProduct(productId, data);
	}
}
