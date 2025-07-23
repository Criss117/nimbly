import { and, eq } from "drizzle-orm";
import type DBClient from "@nimbly/db";
import { schemas, type TX } from "@nimbly/db";
import type { UpdateInstallmentPlanDto } from "@/clients/application/dtos/update-installment.dto";
import type { InsertInstallmentPlan } from "@/clients/application/dtos/create-installment-plan.dto";
import type { InstallmentsCommandsRepository } from "@/clients/domain/repositories/installments-commands.repository";

const installmentPlans = schemas.tables.installmentPlans;
const installmentPayments = schemas.tables.installmentPayments;

export class InstallmentsCommandsRepositoryImpl
	implements InstallmentsCommandsRepository
{
	constructor(private readonly db: DBClient["client"]) {}

	public createInstallmentPlan(
		data: InsertInstallmentPlan,
		tx?: TX,
	): Promise<void> {
		const db = tx ?? this.db;

		return db.transaction(async (tx) => {
			const [planCreated] = await tx
				.insert(installmentPlans)
				.values({
					clientId: data.clientId,
					modality: data.modality,
					numberOfInstallments: data.numberOfInstallments,
					total: data.total,
				})
				.returning({
					id: installmentPlans.id,
				});

			const createPaymentsPromises = data.payments.map((p) =>
				tx.insert(installmentPayments).values({
					dueDate: p.dueDate,
					installmentNumber: p.installmentNumber,
					planId: planCreated.id,
					subtotal: p.subtotal,
				}),
			);

			await Promise.all(createPaymentsPromises);
		});
	}

	updateInstallmentPlan(
		data: UpdateInstallmentPlanDto,
		tx?: TX,
	): Promise<void> {
		const { payments, ...plan } = data;
		const db = tx ?? this.db;

		return db.transaction(async (tx) => {
			await tx
				.update(installmentPlans)
				.set({
					total: plan.total,
					totalPaid: plan.totalPaid,
					status: plan.status,
					updatedAt: new Date(),
				})
				.where(eq(installmentPlans.id, plan.id));

			const updateInstallmentPayments = payments.map((p) =>
				tx
					.update(installmentPayments)
					.set({
						subtotalPaid: p.subtotalPaid,
						subtotal: p.subtotal,
						status: p.status,
						updatedAt: new Date(),
					})
					.where(
						and(
							eq(installmentPayments.id, p.id),
							eq(installmentPayments.planId, plan.id),
						),
					),
			);

			await Promise.all(updateInstallmentPayments);
		});
	}
}
