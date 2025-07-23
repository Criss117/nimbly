import z from "zod";
import { clientId } from "@/shared/value-objects/client.value-object";
import type { schemas } from "@nimbly/db";

type T = typeof schemas.tables.installmentPlans;

export const createInstallmentPlanDto = z.object({
	clientId: clientId,
	total: z
		.number({
			error: "El total es requerido",
		})
		.positive("El total debe ser un número positivo"),
});

export type InsertInstallmentPlan =
	typeof schemas.tables.installmentPlans.$inferInsert & {
		payments: Omit<InsertInstallmentPayment, "planId">[];
	};
export type InsertInstallmentPayment =
	typeof schemas.tables.installmentPayments.$inferInsert;
export type CreateInstallmentPlanDto = z.infer<typeof createInstallmentPlanDto>;
