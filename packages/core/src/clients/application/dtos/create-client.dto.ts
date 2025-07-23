import { z } from "zod";
import { schemas } from "@nimbly/db";

export const createClientDto = z.object({
	fullName: z
		.string({ error: "El nombre completo es obligatorio." })
		.min(5, { message: "El nombre completo debe tener al menos 5 caracteres." })
		.max(255, {
			message: "El nombre completo no puede superar los 255 caracteres.",
		}),

	email: z
		.email({ message: "El correo electrónico no tiene un formato válido." })
		.max(255, {
			message: "El correo electrónico no puede superar los 255 caracteres.",
		})
		.optional()
		.nullish(),

	phone: z
		.string()
		.max(20, { message: "El teléfono no puede superar los 20 caracteres." })
		.optional()
		.nullish(),

	address: z
		.string()
		.max(255, { message: "La dirección no puede superar los 255 caracteres." })
		.optional()
		.nullish(),

	creditLimit: z.coerce
		.number({ error: "El límite de crédito es obligatorio." })
		.int({ message: "El límite de crédito debe ser un número entero." })
		.min(1, { message: "El límite de crédito debe ser al menos 1." }),

	clientCode: z
		.string({ error: "El código del cliente es obligatorio." })
		.min(5, {
			message: "El código del cliente debe tener al menos 5 caracteres.",
		})
		.max(100, {
			message: "El código del cliente no puede superar los 100 caracteres.",
		}),

	globalNumberOfInstallments: z
		.number({ error: "El número de cuotas es obligatorio." })
		.int({ message: "El número de cuotas debe ser un número entero." })
		.min(1, { message: "El número de cuotas debe ser al menos 1." }),

	globalInstallmentModality: z.enum(schemas.shared.installmentModality),
});

export type CreateClientDto = z.infer<typeof createClientDto>;
