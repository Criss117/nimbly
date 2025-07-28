import {
	CreateInstallmentPlanUseCase,
	FindManyInstallmentsByClientUseCase,
	PayInstallmentPlanUseCase,
	ReduceInstallmentPayUseCase,
	ReduceInstallmentTotalUseCase,
} from "@nimbly/core/clients";
import {
	installmentsCommandsRepository,
	installmentsQueriesRepository,
} from "./repositories.container";
import { findOneClientByUseCase } from "./clients.container";

export const createInstallmentPlanUseCase = new CreateInstallmentPlanUseCase(
	installmentsQueriesRepository,
	installmentsCommandsRepository,
	findOneClientByUseCase,
);

export const findManyInstallmentsByClientUseCase =
	new FindManyInstallmentsByClientUseCase(installmentsQueriesRepository);

export const payInstallmentPlanUseCase = new PayInstallmentPlanUseCase(
	installmentsCommandsRepository,
	installmentsQueriesRepository,
);

export const reduceInstallmentPayUseCase = new ReduceInstallmentPayUseCase(
	installmentsQueriesRepository,
	installmentsCommandsRepository,
);

export const reduceInstallmentTotalUseCase = new ReduceInstallmentTotalUseCase(
	installmentsQueriesRepository,
	installmentsCommandsRepository,
);
