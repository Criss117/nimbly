import {
	DeleteManyPaymentsUseCase,
	FindManyPaymentsByClientUseCase,
	PayDebtUseCase,
} from "@nimbly/core/clients";
import {
	installmentsQueriesRepository,
	paymentsCommandsRepository,
	paymentsQueriesRepository,
} from "./repositories.container";
import { dbClient } from "@/config";
import {
	payInstallmentPlanUseCase,
	reduceInstallmentPayUseCase,
} from "./intallments.container";
import {
	decreaseTicketTotalUseCase,
	increaseTicketTotalUseCase,
} from "@/modules/tickets/containers/tickets.container";

export const deleteManyPaymentsUseCase = new DeleteManyPaymentsUseCase(
	paymentsQueriesRepository,
	paymentsCommandsRepository,
	reduceInstallmentPayUseCase,
	decreaseTicketTotalUseCase,
	dbClient,
);

export const findManyPaymentsByClientUseCase =
	new FindManyPaymentsByClientUseCase(paymentsQueriesRepository);

export const payDebtUseCase = new PayDebtUseCase(
	installmentsQueriesRepository,
	paymentsCommandsRepository,
	payInstallmentPlanUseCase,
	increaseTicketTotalUseCase,
	dbClient,
);
