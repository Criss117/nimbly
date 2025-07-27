import { z } from "zod";

export const createTicketItemSchema = z.object({
	productId: z
		.number({
			error: "Selecciona un producto",
		})
		.int("El producto debe ser un número entero")
		.positive("Selecciona un producto válido"),

	description: z
		.string({
			error: "La descripción es obligatoria",
		})
		.max(255, "La descripción no puede superar los 255 caracteres"),

	price: z
		.number({
			error: "El precio es obligatorio",
		})
		.positive("El precio debe ser mayor que cero"),

	quantity: z
		.number({
			error: "La cantidad es obligatoria",
		})
		.int("La cantidad debe ser un número entero")
		.positive("La cantidad debe ser mayor que cero"),
});

export type CreateTicketItemSchema = z.infer<typeof createTicketItemSchema>;
