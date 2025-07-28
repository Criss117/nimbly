import type { InstallmentsQueriesRepository } from "@/clients/domain";
import type { TX } from "@nimbly/db";

export class FindDebtInfoUseCase {
	constructor(
		private readonly installmentsQueriesRepository: InstallmentsQueriesRepository,
	) {}

	public async execute(clientId: string, tx?: TX) {
		const activeInstallment =
			await this.installmentsQueriesRepository.findActivePlan(clientId, tx);

		if (!activeInstallment) {
			return {
				total: 0,
				paid: 0,
				totalDebt: 0,
			};
		}

		return {
			total: activeInstallment?.total ?? 0,
			paid: activeInstallment?.totalPaid ?? 0,
			totalDebt: activeInstallment?.total ?? 0,
		};
	}
}
