import {
	CategoriesCommandsRepositoryImpl,
	CategoriesQueriesRepositoryImpl,
	ProductsCommandsRepositoryImpl,
	ProductsQueriesRepositoryImpl,
} from "@nimbly/core/products";
import { dbClient } from "@/config";

export const categoriesCommandsRepository =
	new CategoriesCommandsRepositoryImpl(dbClient.client);
export const categoriesQueriesRepository = new CategoriesQueriesRepositoryImpl(
	dbClient.client,
);

export const productsCommandsRepository = new ProductsCommandsRepositoryImpl(
	dbClient.client,
);
export const productsQueriesRepository = new ProductsQueriesRepositoryImpl(
	dbClient.client,
);
