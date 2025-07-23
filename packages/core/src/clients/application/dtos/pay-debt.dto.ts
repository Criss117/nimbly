import { z } from "zod";
import { clientId } from "@/shared/value-objects/client.value-object";

export const payDebtDto = z
	.object({
		clientId: clientId,
		amount: z
			.number({ error: "El monto es obligatorio." })
			.int({ message: "El monto debe ser un número entero." })
			.nullish(),
		type: z.enum(["pay_debt", "settle_debt"]),
	})
	.refine(
		(data) =>
			data.type !== "pay_debt" ||
			(data.amount !== null && data.amount !== undefined && data.amount > 0),
		{
			message: "El monto debe ser mayor a 0 cuando el tipo es 'pay_debt'",
			path: ["amount"],
		},
	);

export type PayDebtDto = z.infer<typeof payDebtDto>;
