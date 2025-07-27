import { z } from "zod";
import { schemas } from "@nimbly/db";
import type { InstallmentPayment } from "@/clients/domain/entities/installment.entity";

export const installmentPaymentSummaryDto = z.object({
	id: z
		.number({ error: "El ID debe ser un número" })
		.int("El ID debe ser un número entero")
		.nonnegative("El ID no puede ser negativo"),

	status: z.enum(schemas.shared.payStatus, {
		error: "El estado debe ser 'unpaid', 'paid' o 'partial'",
	}),

	subtotalPaid: z
		.number({ error: "El subTotalPaid debe ser un número" })
		.nonnegative("El subTotalPaid no puede ser negativo"),

	subtotal: z
		.number({ error: "El subtotal debe ser un número" })
		.nonnegative("El subtotal no puede ser negativo"),

	installmentNumber: z
		.number({ error: "El número de cuota debe ser un número" })
		.int("El número de cuota debe ser un número entero")
		.positive("El número de cuota debe ser mayor que cero"),

	// dueDate: z.preprocess((val) => new Date((val as number) * 1000), z.date()),

	// createdAt: z.preprocess((val) => new Date((val as number) * 1000), z.date()),
	dueDate: z.number(),

	createdAt: z.number(),
});

export type InstallmentsPaymentSchema = z.infer<
	typeof installmentPaymentSummaryDto
>;

export function verifyInstallmentPaymentSchema(toParse: string) {
	const { success, data, error } = z
		.array(installmentPaymentSummaryDto)
		.safeParse(JSON.parse(toParse));

	const dataParsed: InstallmentPayment[] = data
		? data.map((p) => ({
				id: p.id,
				status: p.status,
				subtotalPaid: p.subtotalPaid,
				subtotal: p.subtotal,
				installmentNumber: p.installmentNumber,
				dueDate: new Date(p.dueDate * 1000),
				createdAt: new Date(p.createdAt * 1000),
			}))
		: [];

	return {
		success,
		data: dataParsed,
		error,
	};
}
