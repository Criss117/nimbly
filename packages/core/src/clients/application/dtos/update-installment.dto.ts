import { z } from "zod";
import { schemas } from "@nimbly/db";

const payStatus = schemas.shared.payStatus;

export const updateInstallmentPaymentDto = z.object({
	id: z.number().positive().int(),
	subtotal: z.number().positive().int(),
	subtotalPaid: z.number().positive().int(),
	status: z.enum(payStatus),
	installmentNumber: z.number().positive().int(),
});

export const updateInstallmentPlanDto = z.object({
	id: z.number().positive().int(),
	total: z.number().positive().int(),
	totalPaid: z.number().positive().int(),
	status: z.enum(payStatus),
	payments: z.array(updateInstallmentPaymentDto),
});

export type UpdateInstallmentPlanDto = z.infer<typeof updateInstallmentPlanDto>;
export type UpdateInstallmentPayment = z.infer<
	typeof updateInstallmentPaymentDto
>;
