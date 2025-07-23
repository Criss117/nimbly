import type { InstallmentsCommandsRepository } from "@/clients/domain/repositories/installments-commands.repository";
import type { InstallmentsQueriesRepository } from "@/clients/domain/repositories/installments-queries.repository";
import type { PayDebtDto } from "../../dtos/pay-debt.dto";
import type { TX } from "@nimbly/db";
import { distributePayment } from "@/shared/utils/distribute-payments";

export class PayInstallmentPlanUseCase {
	constructor(
		private readonly installmentsCommandsRepository: InstallmentsCommandsRepository,
		private readonly installmentsQueriesRepository: InstallmentsQueriesRepository,
	) {}

	public async execute(data: PayDebtDto, tx?: TX) {
		if (!data.amount) {
			throw new Error("El monto a abonar no puede ser cero", {
				cause: "BAD_REQUEST",
			});
		}

		const activePlan = await this.installmentsQueriesRepository.findActivePlan(
			data.clientId,
		);

		if (!activePlan) {
			throw new Error("EL cliente no tiene un plan de pagos activo", {
				cause: "BAD_REQUEST",
			});
		}

		const totalDebt = activePlan.total - activePlan.totalPaid;

		if (data.amount > totalDebt) {
			throw new Error("El monto a abonar supera la deuda global del cliente", {
				cause: "BAD_REQUEST",
			});
		}

		const newTotalPaid = activePlan.totalPaid + data.amount;

		const unPaidPayments = activePlan.installments.filter(
			(i) => i.status !== "paid",
		);

		const paymentsToUpdate = distributePayment(data.amount, unPaidPayments);

		await this.installmentsCommandsRepository.updateInstallmentPlan(
			{
				id: activePlan.id,
				status: data.amount === totalDebt ? "paid" : "partial",
				total: activePlan.total,
				totalPaid: newTotalPaid,
				payments: paymentsToUpdate,
			},
			tx,
		);
	}
}
