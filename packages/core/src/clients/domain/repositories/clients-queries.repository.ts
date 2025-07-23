import type { ClientDetail, ClientSummary } from "../entities/client.entity";
import type { FindOneClientByDto } from "@/clients/application/dtos/find-one-client.dto";
import type { FindManyClientsDto } from "@/clients/application/dtos/find-many-clients.dto";
import type { ClientId } from "@/shared/value-objects/client.value-object";
import type { TX } from "@nimbly/db";

export interface ClientsQueriesRepository {
	findOne(meta: FindOneClientByDto, tx?: TX): Promise<ClientDetail>;
	findMany(meta: FindManyClientsDto, tx?: TX): Promise<ClientSummary[]>;
	findOneSummary(clientId: ClientId, tx?: TX): Promise<ClientSummary>;
}
