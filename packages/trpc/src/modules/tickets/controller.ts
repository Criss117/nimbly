import { createTRPCRouter, protectedProcedure } from "@/config";
import {
	createTicketDto,
	deleteTicketDto,
	findManyByClient,
} from "@nimbly/core/tickets";
import {
	createTicketUseCase,
	deleteTicketUseCase,
	findManyTicketsByClientUseCase,
} from "./containers/tickets.container";

export const ticketsController = createTRPCRouter({
	create: protectedProcedure
		.input(createTicketDto)
		.mutation(({ input }) => createTicketUseCase.execute(input)),

	findManyByClient: protectedProcedure
		.input(findManyByClient)
		.query(({ input }) =>
			findManyTicketsByClientUseCase.execute(input.clientId),
		),

	delete: protectedProcedure
		.input(deleteTicketDto)
		.mutation(({ input }) => deleteTicketUseCase.execute(input)),
});
