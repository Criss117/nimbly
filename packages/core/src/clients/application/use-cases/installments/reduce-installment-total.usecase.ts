import type { TX } from "@nimbly/db";
import type {
	InstallmentsCommandsRepository,
	InstallmentsQueriesRepository,
} from "@/clients/domain";
import { calculateInstallments } from "@/shared/utils/calculate-installments";

/**
 * Use case para reducir el total de un plan de pagos
 */
export class ReduceInstallmentTotalUseCase {
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

		const currentTotalDebt = activePlan.total - activePlan.totalPaid;

		if (currentTotalDebt < amount) {
			throw new Error(
				"No puedes reducir el total del plan por más que el total de la deuda",
				{
					cause: "BAD_REQUEST",
				},
			);
		}

		const unPaidPayments = activePlan.installments.filter(
			(i) => i.status !== "paid",
		);

		const newTotalDebt = currentTotalDebt - amount;

		const totalDistributed = calculateInstallments(
			newTotalDebt,
			unPaidPayments.length,
		);

		const paymentsToUpdate = unPaidPayments.map((payment, index) => ({
			...payment,
			subtotal: totalDistributed[index],
		}));

		await this.installmentsCommandsRepository.updateInstallmentPlan(
			{
				id: activePlan.id,
				status: activePlan.status,
				total: newTotalDebt,
				totalPaid: activePlan.totalPaid,
				payments: paymentsToUpdate,
			},
			tx,
		);
	}
}
