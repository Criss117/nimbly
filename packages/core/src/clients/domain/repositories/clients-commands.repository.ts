import type { TX } from "@nimbly/db";
import type { CreateClientDto } from "@/clients/application/dtos/create-client.dto";
import type { UpdateClientDto } from "@/clients/application/dtos/update-client.dto";
import type { ClientSummary } from "../entities/client.entity";

export interface ClientsCommandsRepository {
	createClient(data: CreateClientDto, tx?: TX): Promise<ClientSummary>;
	updateClient(data: UpdateClientDto, tx?: TX): Promise<ClientSummary>;
}
