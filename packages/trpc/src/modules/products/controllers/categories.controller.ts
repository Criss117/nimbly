import { createTRPCRouter, protectedProcedure } from "@/config";
import {
	createCategoryDto,
	findManyCategoriesDto,
} from "@nimbly/core/products";
import {
	createCategoryUseCase,
	findManyCategoriesUseCase,
} from "../containers/categories.container";

export const categoriesController = createTRPCRouter({
	findMany: protectedProcedure
		.input(findManyCategoriesDto)
		.query(({ input }) => findManyCategoriesUseCase.execute(input)),

	create: protectedProcedure
		.input(createCategoryDto)
		.mutation(({ input }) => createCategoryUseCase.execute(input)),
});
