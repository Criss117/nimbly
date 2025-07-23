import {
	and,
	desc,
	eq,
	getTableColumns,
	gt,
	isNotNull,
	like,
	lte,
	or,
	sql,
} from "drizzle-orm";
import type DBClient from "@nimbly/db";
import { schemas } from "@nimbly/db";

import type { FindManyProductsDto } from "@/products/application/dtos/find-many-products.dto";
import type { FindOneProductByDto } from "@/products/application/dtos/find.dto";
import type {
	ProductsQueriesRepository,
	ProductDetail,
	ProductSummary,
} from "@/products/domain";
import type { CategoryDetail } from "@/products/domain/entities/category.entity";

const products = schemas.tables.products;
const categories = schemas.tables.categories;

export class ProductsQueriesRepositoryImpl
	implements ProductsQueriesRepository
{
	constructor(private readonly db: DBClient["client"]) {}

	public async findAll(): Promise<{
		products: ProductSummary[];
		categories: CategoryDetail[];
	}> {
		const allProductsPromise = this.db.select().from(products);

		const allCategoriesPromise = this.db.select().from(categories);

		const [allProducts, allCategories] = await Promise.all([
			allProductsPromise,
			allCategoriesPromise,
		]);

		return {
			products: allProducts,
			categories: allCategories,
		};
	}

	public findMany(meta: FindManyProductsDto): Promise<ProductDetail[]> {
		const { cursor, limit, searchQuery } = meta;

		return this.db
			.select({
				...getTableColumns(products),
				category: {
					id: categories.id,
					name: categories.name,
					description: categories.description,
				},
			})
			.from(products)
			.leftJoin(categories, eq(categories.id, products.categoryId))
			.where(
				and(
					or(
						cursor.createdAt
							? lte(products.createdAt, cursor.createdAt)
							: sql`true`,
						and(
							cursor.createdAt
								? eq(products.createdAt, cursor.createdAt)
								: sql`true`,
							cursor.lastId ? lte(products.id, cursor.lastId) : sql`true`,
						),
					),
					or(
						searchQuery
							? like(products.description, `%${searchQuery}%`)
							: sql`true`,
						searchQuery
							? like(products.barcode, `%${searchQuery}%`)
							: sql`true`,
					),
					eq(products.isActive, true),
					isNotNull(products.barcode),
				),
			)
			.orderBy(desc(products.createdAt))
			.limit(limit + 1);
	}

	public async findOneBy(meta: FindOneProductByDto): Promise<ProductDetail> {
		const { barcode, productId } = meta;

		if (!barcode && !productId) {
			return null;
		}

		const [product] = await this.db
			.select({
				...getTableColumns(products),
				category: {
					id: categories.id,
					name: categories.name,
					description: categories.description,
				},
			})
			.from(products)
			.leftJoin(categories, eq(categories.id, products.categoryId))
			.where(
				and(
					barcode ? eq(products.barcode, barcode) : sql`true`,
					productId ? eq(products.id, productId) : sql`true`,
					eq(products.isActive, true),
					isNotNull(products.barcode),
				),
			);

		if (!product) {
			return null;
		}

		return product;
	}

	public findManyLastProductsUpdated(
		lastUpdatedAt: Date,
	): Promise<ProductSummary[]> {
		return this.db
			.select()
			.from(products)
			.where(
				and(
					gt(products.updatedAt, lastUpdatedAt),
					eq(products.isActive, true),
					isNotNull(products.barcode),
				),
			);
	}
}
