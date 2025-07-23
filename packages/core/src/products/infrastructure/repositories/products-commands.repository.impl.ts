import { eq, sql } from "drizzle-orm";
import type DBClient from "@nimbly/db";
import { schemas, type TX } from "@nimbly/db";
import type { ProductsCommandsRepository } from "@/products/domain/repositories/products-commands.repository";
import type {
	CreateProductDto,
	UpdateProductDto,
	UpdateStockDto,
} from "@/products/application";

const products = schemas.tables.products;

export class ProductsCommandsRepositoryImpl
	implements ProductsCommandsRepository
{
	constructor(private readonly db: DBClient["client"]) {}

	public async createProduct(data: CreateProductDto, tx?: TX): Promise<void> {
		const db = tx ?? this.db;

		await db.insert(products).values(data);
	}

	public async updateProduct(
		productId: number,
		data: UpdateProductDto,
		tx?: TX,
	): Promise<void> {
		const db = tx ?? this.db;

		await db
			.update(products)
			.set({
				...data,
				updatedAt: new Date(),
			})
			.where(eq(products.id, productId));
	}

	public async deleteProduct(productId: number, tx?: TX): Promise<void> {
		const db = tx ?? this.db;

		await db
			.update(products)
			.set({
				barcode: null,
				deletedAt: new Date(),
				isActive: false,
			})
			.where(eq(products.id, productId));
	}

	public async updateStock(data: UpdateStockDto, tx?: TX): Promise<void> {
		const db = tx ? tx : this.db;

		await db
			.update(products)
			.set({
				stock: sql`${products.stock} - ${data.quantity}`,
				updatedAt: new Date(),
			})
			.where(eq(products.id, data.productId));
	}
}
