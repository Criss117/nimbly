import type { CreateCategoryDto } from "@/products/application";
import type { CategoriesCommandsRepository } from "@/products/domain/repositories/categories-commands.repository";
import type DBClient from "@nimbly/db";
import { schemas } from "@nimbly/db";

const categories = schemas.tables.categories;

export class CategoriesCommandsRepositoryImpl
	implements CategoriesCommandsRepository
{
	constructor(private readonly db: DBClient["client"]) {}

	public async createCategory(data: CreateCategoryDto) {
		await this.db.insert(categories).values(data);
	}
}
