import { createTRPCRouter, protectedProcedure } from "@/config";
import {
	createClientDto,
	deleteManyPaymentsByIdsDto,
	findManyClientsDto,
	findManyInstallmentsDto,
	findManyPaymentsDto,
	findOneClientByDto,
	payDebtDto,
	updateClientDto,
} from "@nimbly/core/clients";
import {
	createClientUseCase,
	findManyClientsUseCase,
	findOneClientByUseCase,
	updateClientUseCase,
} from "./containers/clients.container";
import { findManyInstallmentsByClientUseCase } from "./containers/intallments.container";
import {
	deleteManyPaymentsUseCase,
	findManyPaymentsByClientUseCase,
	payDebtUseCase,
} from "./containers/payments.container";

export const clientsController = createTRPCRouter({
	findMany: protectedProcedure
		.input(findManyClientsDto)
		.query(({ input }) => findManyClientsUseCase.execute(input)),

	findOneBy: protectedProcedure
		.input(findOneClientByDto)
		.query(({ input }) => findOneClientByUseCase.execute(input)),

	findManyInstallments: protectedProcedure
		.input(findManyInstallmentsDto)
		.query(({ input }) => findManyInstallmentsByClientUseCase.execute(input)),

	findManyPayments: protectedProcedure
		.input(findManyPaymentsDto)
		.query(({ input }) => findManyPaymentsByClientUseCase.execute(input)),

	createClient: protectedProcedure
		.input(createClientDto)
		.mutation(({ input }) => createClientUseCase.execute(input)),

	updateClient: protectedProcedure
		.input(updateClientDto)
		.mutation(({ input }) => updateClientUseCase.execute(input)),

	payDebt: protectedProcedure
		.input(payDebtDto)
		.mutation(({ input }) => payDebtUseCase.execute(input)),

	deleteManyPayments: protectedProcedure
		.input(deleteManyPaymentsByIdsDto)
		.mutation(({ input }) => deleteManyPaymentsUseCase.execute(input)),

	findAll: protectedProcedure.query(() =>
		findManyClientsUseCase.execute({
			cursor: {
				createdAt: undefined,
				lastClientCode: undefined,
			},
			limit: 20,
			searchQuery: undefined,
		}),
	),
});
