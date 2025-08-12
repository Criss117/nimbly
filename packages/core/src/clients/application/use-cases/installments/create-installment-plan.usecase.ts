import type { InstallmentsCommandsRepository } from "@/clients/domain/repositories/installments-commands.repository";
import type { InstallmentsQueriesRepository } from "@/clients/domain/repositories/installments-queries.repository";
import type { FindOneClientByUseCase } from "../clients/find-one-client-by.usecase";
import type { CreateInstallmentPlanDto } from "../../dtos/create-installment-plan.dto";
import type { TX } from "@nimbly/db";
import { generateDueDates } from "@/shared/utils/due-dates";
import { calculateInstallments } from "@/shared/utils/calculate-installments";

export class CreateInstallmentPlanUseCase {
	constructor(
		private readonly installmentsQueriesRepository: InstallmentsQueriesRepository,
		private readonly installmentsCommandsRepository: InstallmentsCommandsRepository,
		private readonly findOneClientByUseCase: FindOneClientByUseCase,
	) {}

	public async execute(data: CreateInstallmentPlanDto, tx?: TX) {
		const activePlan = await this.installmentsQueriesRepository.findActivePlan(
			data.clientId,
			tx,
		);

		if (activePlan && activePlan.id !== null) {
			const unPaidPayments = activePlan.installments.filter(
				(i) => i.status !== "paid",
			);

			const totalDebt = activePlan.total - activePlan.totalPaid;

			const totalDistributed = calculateInstallments(
				totalDebt + data.total,
				unPaidPayments.length,
			);

			const paymentsToUpdate = unPaidPayments.map((payment, index) => ({
				...payment,
				subtotal: totalDistributed[index],
			}));

			return this.installmentsCommandsRepository.updateInstallmentPlan(
				{
					id: activePlan.id,
					status: data.total === activePlan.total ? "paid" : activePlan.status,
					total: activePlan.total + data.total,
					totalPaid: activePlan.totalPaid,
					payments: paymentsToUpdate,
				},
				tx,
			);
		}

		const client = await this.findOneClientByUseCase.execute({
			clientId: data.clientId,
		});

		const installments = calculateInstallments(
			data.total,
			client.globalNumberOfInstallments,
		);

		const dueDates = generateDueDates(
			client.globalInstallmentModality,
			client.globalNumberOfInstallments,
		);

		const paymentsToInsert = installments.map((total, index) => ({
			subtotal: total,
			installmentNumber: index + 1,
			dueDate: dueDates[index],
		}));

		return this.installmentsCommandsRepository.createInstallmentPlan(
			{
				clientId: client.id,
				modality: client.globalInstallmentModality,
				numberOfInstallments: client.globalNumberOfInstallments,
				total: data.total,
				payments: paymentsToInsert,
			},
			tx,
		);
	}
}
