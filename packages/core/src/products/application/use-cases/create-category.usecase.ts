import type { CategoriesCommandsRepository } from "@/products/domain/repositories/categories-commands.repository";
import type { CreateCategoryDto } from "../dtos/category.dto";

export class CreateCategoryUseCase {
	constructor(
		private readonly categoriesCommandsRepositor: CategoriesCommandsRepository,
	) {}

	public async execute(data: CreateCategoryDto) {
		return this.categoriesCommandsRepositor.createCategory(data);
	}
}
