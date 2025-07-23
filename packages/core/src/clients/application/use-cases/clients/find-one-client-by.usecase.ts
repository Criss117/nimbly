import type { ClientDetail, ClientsQueriesRepository } from "@/clients/domain";
import type { FindOneClientByDto } from "@/clients/application/dtos/find-one-client.dto";

export class FindOneClientByUseCase {
	constructor(
		private readonly clientsQueriesRepository: ClientsQueriesRepository,
	) {}

	public async execute(meta: FindOneClientByDto): Promise<ClientDetail> {
		const client = await this.clientsQueriesRepository.findOne(meta);

		if (!client) {
			throw new Error("El cliente no existe", {
				cause: "NOT_FOUND",
			});
		}

		return client;
	}
}
