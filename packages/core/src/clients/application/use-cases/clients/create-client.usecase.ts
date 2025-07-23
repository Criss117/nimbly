import type { ClientsCommandsRepository } from "@/clients/domain";
import type { CreateClientDto } from "../../dtos/create-client.dto";

export class CreateClientUseCase {
	constructor(
		private readonly clientsCommandsRepository: ClientsCommandsRepository,
	) {}

	public async execute(data: CreateClientDto) {
		return this.clientsCommandsRepository.createClient(data);
	}
}
