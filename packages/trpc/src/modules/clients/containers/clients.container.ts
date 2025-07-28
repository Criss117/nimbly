import {
	CreateClientUseCase,
	FindManyClientsUseCase,
	FindOneClientByUseCase,
	UpdateClientUseCase,
	FindDebtInfoUseCase,
} from "@nimbly/core/clients";
import {
	clientsCommandsRepository,
	clientsQueriesRepository,
	installmentsQueriesRepository,
} from "./repositories.container";

export const createClientUseCase = new CreateClientUseCase(
	clientsCommandsRepository,
);

export const findManyClientsUseCase = new FindManyClientsUseCase(
	clientsQueriesRepository,
);

export const findOneClientByUseCase = new FindOneClientByUseCase(
	clientsQueriesRepository,
);

export const updateClientUseCase = new UpdateClientUseCase(
	clientsCommandsRepository,
	clientsQueriesRepository,
	installmentsQueriesRepository,
);

export const findDebtInfoUseCase = new FindDebtInfoUseCase(
	installmentsQueriesRepository,
);
