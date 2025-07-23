import {
	TicketsCommandsRepositoryImpl,
	TicketsQueriesRepositoryImpl,
} from "@nimbly/core/tickets";
import { dbClient } from "@/config";

export const ticketsCommandsRepository = new TicketsCommandsRepositoryImpl(
	dbClient.client,
);

export const ticketsQueriesRepository = new TicketsQueriesRepositoryImpl(
	dbClient.client,
);
