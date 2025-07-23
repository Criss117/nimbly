import { createTRPCRouter, publicProcedure } from "./config";
import { clientsController } from "./modules/clients/controller";
import { categoriesController } from "./modules/products/controllers/categories.controller";
import { productsController } from "./modules/products/controllers/products.controller";
import { ticketsController } from "./modules/tickets/controller";

export const appRouter = createTRPCRouter({
	greets: publicProcedure.query(() => "hello world"),
	products: productsController,
	categories: categoriesController,
	clients: clientsController,
	tickets: ticketsController,
});

export type AppRouter = typeof appRouter;
