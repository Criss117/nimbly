import type {
	FindManyCategoriesDto,
	FindOneCategoryByDto,
} from "@/products/application";
import type { CategoryDetail } from "../entities/category.entity";

export interface CategoriesQueriesRepository {
	findMany(meta: FindManyCategoriesDto): Promise<CategoryDetail[]>;
	findOneBy(meta: FindOneCategoryByDto): Promise<CategoryDetail>;
	findAll(): Promise<CategoryDetail[]>;
}
