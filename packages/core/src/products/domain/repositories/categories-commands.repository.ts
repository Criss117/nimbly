import type { CreateCategoryDto } from "@/products/application";

export interface CategoriesCommandsRepository {
	createCategory(data: CreateCategoryDto): Promise<void>;
}
