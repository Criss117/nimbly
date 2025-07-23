import { and, desc, eq, like, lte, or, sql } from "drizzle-orm";
import type DBClient from "@nimbly/db";
import { schemas } from "@nimbly/db";
import type {
	FindManyCategoriesDto,
	FindOneCategoryByDto,
} from "@/products/application";
import type { CategoryDetail } from "@/products/domain/entities/category.entity";
import type { CategoriesQueriesRepository } from "@/products/domain/repositories/categories-queries.repository";

const categories = schemas.tables.categories;

export class CategoriesQueriesRepositoryImpl
	implements CategoriesQueriesRepository
{
	constructor(private readonly db: DBClient["client"]) {}

	public findMany(meta: FindManyCategoriesDto): Promise<CategoryDetail[]> {
		const { cursor, limit, searchQuery } = meta;

		return this.db
			.select()
			.from(categories)
			.where(
				and(
					or(
						cursor.createdAt
							? lte(categories.createdAt, cursor.createdAt)
							: sql`true`,
						and(
							cursor.createdAt
								? eq(categories.createdAt, cursor.createdAt)
								: sql`true`,
							cursor.lastId ? lte(categories.id, cursor.lastId) : sql`true`,
						),
					),
					or(
						searchQuery ? like(categories.name, `%${searchQuery}%`) : sql`true`,
					),
					eq(categories.isActive, true),
				),
			)
			.orderBy(desc(categories.createdAt))
			.limit(limit + 1);
	}

	public async findOneBy(meta: FindOneCategoryByDto): Promise<CategoryDetail> {
		const { categoryId, name } = meta;
		const [category] = await this.db
			.select()
			.from(categories)
			.where(
				or(
					categoryId ? eq(categories.id, categoryId) : sql`true`,
					name ? like(categories.name, `%${name}%`) : sql`true`,
				),
			);

		if (!category) {
			return null;
		}

		return category;
	}
}
