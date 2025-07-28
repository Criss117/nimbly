import {
	CreateTicketUseCase,
	DecreaseTicketTotalUseCase,
	DeleteTicketUseCase,
	FindManyTicketsByClientUseCase,
	IncreaseTicketTotalUseCase,
	ReturnFormTicketUseCase,
} from "@nimbly/core/tickets";
import {
	ticketsCommandsRepository,
	ticketsQueriesRepository,
} from "./repositories.container";
import { dbClient } from "@/config";
import {
	createInstallmentPlanUseCase,
	reduceInstallmentPayUseCase,
	reduceInstallmentTotalUseCase,
} from "@/modules/clients/containers/intallments.container";
import { updateProductStockUseCase } from "@/modules/products/containers/products.container";
import { findDebtInfoUseCase } from "@/modules/clients/containers/clients.container";

export const createTicketUseCase = new CreateTicketUseCase(
	ticketsCommandsRepository,
	updateProductStockUseCase,
	createInstallmentPlanUseCase,
	dbClient,
);

export const decreaseTicketTotalUseCase = new DecreaseTicketTotalUseCase(
	ticketsQueriesRepository,
	ticketsCommandsRepository,
);

export const deleteTicketUseCase = new DeleteTicketUseCase(
	ticketsQueriesRepository,
	ticketsCommandsRepository,
	reduceInstallmentPayUseCase,
	dbClient,
);

export const findManyTicketsByClientUseCase =
	new FindManyTicketsByClientUseCase(ticketsQueriesRepository);

export const increaseTicketTotalUseCase = new IncreaseTicketTotalUseCase(
	ticketsQueriesRepository,
	ticketsCommandsRepository,
);

export const returnFormTicketUseCase = new ReturnFormTicketUseCase(
	ticketsQueriesRepository,
	ticketsCommandsRepository,
	findDebtInfoUseCase,
	updateProductStockUseCase,
	reduceInstallmentTotalUseCase,
	dbClient,
);
