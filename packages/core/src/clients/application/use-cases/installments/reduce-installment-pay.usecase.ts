import type { TX } from "@nimbly/db";
import { updateInstallmentStatus } from "@/shared/utils/distribute-payments";
import type { InstallmentsCommandsRepository } from "@/clients/domain/repositories/installments-commands.repository";
import type { InstallmentsQueriesRepository } from "@/clients/domain/repositories/installments-queries.repository";

/**
 * Use case para reducir el monto pagado de un plan de pagos
 */
export class ReduceInstallmentPayUseCase {
	constructor(
		private readonly installmentsQueriesRepository: InstallmentsQueriesRepository,
		private readonly installmentsCommandsRepository: InstallmentsCommandsRepository,
	) {}

	public async execute(clientId: string, amount: number, tx?: TX) {
		const activePlan = await this.installmentsQueriesRepository.findActivePlan(
			clientId,
			tx,
		);

		if (!activePlan) {
			throw new Error("EL cliente no tiene un plan de pagos activo", {
				cause: "BAD_REQUEST",
			});
		}

		if (activePlan.totalPaid < amount) {
			throw new Error("El monto a reducir no es mayor al total pagado", {
				cause: "BAD_REQUEST",
			});
		}

		const orderedInstallmentsPayments = activePlan.installments.sort(
			(a, b) => b.installmentNumber - a.installmentNumber,
		);

		const paymentsToUpdate = updateInstallmentStatus(
			orderedInstallmentsPayments,
			amount,
		);

		await this.installmentsCommandsRepository.updateInstallmentPlan(
			{
				id: activePlan.id,
				status: activePlan.totalPaid - amount === 0 ? "unpaid" : "partial",
				total: activePlan.total,
				totalPaid: activePlan.totalPaid - amount,
				payments: paymentsToUpdate,
			},
			tx,
		);
	}
}
