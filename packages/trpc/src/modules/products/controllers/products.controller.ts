import { createTRPCRouter, protectedProcedure } from "@/config";
import {
	createProductDto,
	findManyProductsDto,
	findOneProductByDto,
	updateProductDto,
} from "@nimbly/core/products";
import { z } from "zod";
import {
	createProductUseCase,
	deleteProductUseCase,
	findAllProductsUseCase,
	findManyLastUpdatedProductsUseCase,
	findManyProductsUseCase,
	findOneProductByUseCase,
	updatePorductUseCase,
} from "../containers/products.container";

export const productsController = createTRPCRouter({
	findMany: protectedProcedure
		.input(findManyProductsDto)
		.query(({ input }) => findManyProductsUseCase.execute(input)),

	findAll: protectedProcedure.query(() => findAllProductsUseCase.execute()),

	create: protectedProcedure
		.input(createProductDto)
		.mutation(async ({ input }) => createProductUseCase.execute(input)),

	update: protectedProcedure
		.input(
			z.object({
				productId: z.number(),
				data: updateProductDto,
			}),
		)
		.mutation(async ({ input }) =>
			updatePorductUseCase.execute(input.productId, input.data),
		),

	delete: protectedProcedure
		.input(
			z.object({
				productId: z.number(),
			}),
		)
		.mutation(({ input }) => deleteProductUseCase.execute(input.productId)),

	findOneBy: protectedProcedure
		.input(findOneProductByDto)
		.query(({ input }) => findOneProductByUseCase.execute(input)),

	findManyLastUpdatedProducts: protectedProcedure
		.input(z.date())
		.query(({ input }) => findManyLastUpdatedProductsUseCase.execute(input)),
});
