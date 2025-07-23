import type {
	CreateProductDto,
	UpdateProductDto,
	UpdateStockDto,
} from "@/products/application";
import type { TX } from "@nimbly/db";

export interface ProductsCommandsRepository {
	createProduct(data: CreateProductDto, tx?: TX): Promise<void>;
	updateProduct(
		productId: number,
		data: UpdateProductDto,
		tx?: TX,
	): Promise<void>;
	deleteProduct(productId: number, tx?: TX): Promise<void>;
	updateStock(data: UpdateStockDto, tx?: TX): Promise<void>;
}
