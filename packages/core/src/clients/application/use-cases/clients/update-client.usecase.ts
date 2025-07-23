import type {
	ClientsCommandsRepository,
	ClientsQueriesRepository,
} from "@/clients/domain";
import type { InstallmentsQueriesRepository } from "@/clients/domain/repositories/installments-queries.repository";
import type { UpdateClientDto } from "@/clients/application/dtos/update-client.dto";
import type { TX } from "@nimbly/db";

export class UpdateClientUseCase {
	constructor(
		private readonly clientsCommandsRepository: ClientsCommandsRepository,
		private readonly clientsQueriesRepository: ClientsQueriesRepository,
		private readonly installmentsQueryRepository: InstallmentsQueriesRepository,
	) {}

	public async execute(data: UpdateClientDto, tx?: TX) {
		const existingClient = await this.clientsQueriesRepository.findOneSummary(
			data.clientId,
		);

		if (!existingClient) {
			throw new Error("El cliente no existe", {
				cause: "NOT_FOUND",
			});
		}

		if (
			data.globalInstallmentModality !==
				existingClient.globalInstallmentModality ||
			data.globalNumberOfInstallments !==
				existingClient.globalNumberOfInstallments
		) {
			const activePlan = await this.installmentsQueryRepository.findActivePlan(
				data.clientId,
			);

			if (activePlan) {
				throw new Error("Ya existe una cuota activa", {
					cause: "CONFLICT",
				});
			}
		}

		return this.clientsCommandsRepository.updateClient(data, tx);
	}
}
