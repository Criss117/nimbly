import { and, desc, eq, like, lte, or, type SQL, sql } from "drizzle-orm";
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

	public findAll(): Promise<CategoryDetail[]> {
		return this.db
			.select()
			.from(categories)
			.where(eq(categories.isActive, true));
	}

	public findMany(meta: FindManyCategoriesDto): Promise<CategoryDetail[]> {
		const { limit } = meta;

		const cursorFilters: SQL[] = [];

		meta.cursor &&
			cursorFilters.push(
				or(
					lte(categories.createdAt, meta.cursor.createdAt),
					and(
						eq(categories.createdAt, meta.cursor.createdAt),
						lte(categories.id, meta.cursor.lastId),
					),
				),
			);

		const searchFilters: SQL[] = [];

		meta.searchQuery &&
			searchFilters.push(or(like(categories.name, `%${meta.searchQuery}%`)));

		return this.db
			.select()
			.from(categories)
			.where(
				and(...cursorFilters, ...searchFilters, eq(categories.isActive, true)),
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
