import type { ProductsCommandsRepository } from "@/products/domain/repositories/products-commands.repository";
import type { UpdateStockDto } from "../dtos/update-stock.dto";
import type { TX } from "@nimbly/db";

export class UpdateProductStockUseCase {
	constructor(
		private readonly productsCommandsRepository: ProductsCommandsRepository,
	) {}

	public async execute(data: UpdateStockDto, tx?: TX) {
		return this.productsCommandsRepository.updateStock(data, tx);
	}
}
