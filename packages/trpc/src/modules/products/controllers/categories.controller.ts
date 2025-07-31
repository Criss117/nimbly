import { createTRPCRouter, protectedProcedure } from "@/config";
import {
	createCategoryDto,
	findManyCategoriesDto,
} from "@nimbly/core/products";
import {
	createCategoryUseCase,
	findAllCategoriesUseCase,
	findManyCategoriesUseCase,
} from "../containers/categories.container";

export const categoriesController = createTRPCRouter({
	findMany: protectedProcedure
		.input(findManyCategoriesDto)
		.query(({ input }) => findManyCategoriesUseCase.execute(input)),

	create: protectedProcedure
		.input(createCategoryDto)
		.mutation(({ input }) => createCategoryUseCase.execute(input)),

	findAll: protectedProcedure.query(() => findAllCategoriesUseCase.execute()),
});
