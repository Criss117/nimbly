import type { PaymentsCommandsRepository } from "@/clients/domain/repositories/payments-commands.repository";
import type { PaymentsQueriesRepository } from "@/clients/domain/repositories/payments-queries.repository";
import type { ReduceInstallmentPayUseCase } from "../installments/reduce-installment-pay.usecase";
import type { DeleteManyPaymentsByIdsDto } from "../../dtos/delete-many-payments-by-ids.dto";
import type DBClient from "@nimbly/db";
import type { DecreaseTicketTotalUseCase } from "@/tickets/application/use-cases/decrease-ticket-total.usecase";

export class DeleteManyPaymentsUseCase {
	constructor(
		private readonly paymentsQueriesRepository: PaymentsQueriesRepository,
		private readonly paymentsCommandsRepository: PaymentsCommandsRepository,
		private readonly reduceInstallmentPayUseCase: ReduceInstallmentPayUseCase,
		private readonly decreaseTicketTotalUseCase: DecreaseTicketTotalUseCase,
		private readonly dbClient: DBClient,
	) {}

	public async execute(meta: DeleteManyPaymentsByIdsDto) {
		const payments = await this.paymentsQueriesRepository.findAllByIds(meta);

		if (payments.length !== meta.ids.length) {
			throw new Error("El monto a reducir no es mayor al total pagado", {
				cause: "BAD_REQUEST",
			});
		}

		const total = payments.reduce((acc, p) => p.amount + acc, 0);

		return this.dbClient.transaction(async (tx) => {
			const deletePaymentsPromises =
				this.paymentsCommandsRepository.deleteManyByIds(meta, tx);

			const decressTotalPaidPromise = this.decreaseTicketTotalUseCase.execute(
				meta.clientId,
				total,
				tx,
			);

			const reducePayPromises = this.reduceInstallmentPayUseCase.execute(
				meta.clientId,
				total,
				tx,
			);

			return Promise.all([
				reducePayPromises,
				deletePaymentsPromises,
				decressTotalPaidPromise,
			]);
		});
	}
}
