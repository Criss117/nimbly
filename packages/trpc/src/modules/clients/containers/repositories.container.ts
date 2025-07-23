import {
	ClientsCommandsRepositoryImpl,
	ClientsQueriesRepositoryImpl,
	PaymentsCommandsRepositoryImpl,
	PaymentsQueriesRepositoryImpl,
	InstallmentsCommandsRepositoryImpl,
	InstallmentsQueriesRepositoryImpl,
} from "@nimbly/core/clients";

import { dbClient } from "@/config";

export const clientsCommandsRepository = new ClientsCommandsRepositoryImpl(
	dbClient.client,
);
export const clientsQueriesRepository = new ClientsQueriesRepositoryImpl(
	dbClient.client,
);

export const paymentsCommandsRepository = new PaymentsCommandsRepositoryImpl(
	dbClient.client,
);
export const paymentsQueriesRepository = new PaymentsQueriesRepositoryImpl(
	dbClient.client,
);

export const installmentsCommandsRepository =
	new InstallmentsCommandsRepositoryImpl(dbClient.client);

export const installmentsQueriesRepository =
	new InstallmentsQueriesRepositoryImpl(dbClient.client);
