import {
	CreateProductUseCase,
	DeleteProductUseCase,
	FindAllProductsUseCase,
	FindManyLastUpdatedProductsUseCase,
	FindManyProductsUseCase,
	FindOneProductByUseCase,
	UpdateProductStockUseCase,
	UpdateProductUseCase,
} from "@nimbly/core/products";
import {
	categoriesQueriesRepository,
	productsCommandsRepository,
	productsQueriesRepository,
} from "./repositories.container";

export const createProductUseCase = new CreateProductUseCase(
	productsCommandsRepository,
);

export const deleteProductUseCase = new DeleteProductUseCase(
	productsCommandsRepository,
);

export const findAllProductsUseCase = new FindAllProductsUseCase(
	productsQueriesRepository,
);

export const findManyProductsUseCase = new FindManyProductsUseCase(
	productsQueriesRepository,
);

export const findManyLastUpdatedProductsUseCase =
	new FindManyLastUpdatedProductsUseCase(productsQueriesRepository);

export const findOneProductByUseCase = new FindOneProductByUseCase(
	productsQueriesRepository,
);

export const updatePorductUseCase = new UpdateProductUseCase(
	productsQueriesRepository,
	productsCommandsRepository,
	categoriesQueriesRepository,
);

export const updateProductStockUseCase = new UpdateProductStockUseCase(
	productsCommandsRepository,
);
