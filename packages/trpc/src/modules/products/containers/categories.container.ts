import {
	CreateCategoryUseCase,
	FindAllCategoriesUseCase,
	FindManyCategoriesUseCase,
} from "@nimbly/core/products";
import {
	categoriesCommandsRepository,
	categoriesQueriesRepository,
} from "./repositories.container";

export const createCategoryUseCase = new CreateCategoryUseCase(
	categoriesCommandsRepository,
);

export const findManyCategoriesUseCase = new FindManyCategoriesUseCase(
	categoriesQueriesRepository,
);

export const findAllCategoriesUseCase = new FindAllCategoriesUseCase(
	categoriesQueriesRepository,
);
