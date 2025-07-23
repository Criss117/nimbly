import type { InstallmentsQueriesRepository } from "@/clients/domain/repositories/installments-queries.repository";
import type { PayInstallmentPlanUseCase } from "../installments/pay-installment-plan.usecase";
import type { PayDebtDto } from "@/clients/application/dtos/pay-debt.dto";
import type DBClient from "@nimbly/db";
import type { IncreaseTicketTotalUseCase } from "@/tickets/application/use-cases/increase-ticket-total.usecase";
import type { PaymentsCommandsRepository } from "@/clients/domain/repositories/payments-commands.repository";

export class PayDebtUseCase {
	constructor(
		private readonly installmentsQueriesRepository: InstallmentsQueriesRepository,
		private readonly paymentsCommandsRepository: PaymentsCommandsRepository,
		private readonly payInstallmentPlanUseCase: PayInstallmentPlanUseCase,
		private readonly increaseTicketTotalUseCase: IncreaseTicketTotalUseCase,
		private readonly dbClient: DBClient,
	) {}

	public async execute(data: PayDebtDto) {
		let amount = data.amount || 0;
		let payType = data.type || "pay_debt";

		const totalDebt = await this.installmentsQueriesRepository.totalDebt(
			data.clientId,
		);

		if (amount === totalDebt || payType === "settle_debt") {
			payType = "settle_debt";
			amount = totalDebt;
		}

		await this.dbClient.transaction(async (tx) => {
			if (payType === "pay_debt") {
				await this.paymentsCommandsRepository.createPayment(
					{
						...data,
						amount,
					},
					tx,
				);
			}

			if (payType === "settle_debt") {
				await this.paymentsCommandsRepository.deleteAllByClient(
					data.clientId,
					tx,
				);
			}

			const updateInstallmentsPromise = this.payInstallmentPlanUseCase.execute(
				{
					...data,
					amount,
				},
				tx,
			);

			const updateTicketTotalPaid = this.increaseTicketTotalUseCase.execute(
				data.clientId,
				amount,
				tx,
			);

			await Promise.all([updateInstallmentsPromise, updateTicketTotalPaid]);
		});
	}
}
