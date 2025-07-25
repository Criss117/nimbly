import { z } from "zod";

export const baseProductDto = z.object({
	barcode: z
		.string({ error: "El código de barras es requerido" })
		.max(255, {
			message: "El código de barras no puede exceder los 255 caracteres",
		})
		.trim()
		.min(1, { message: "El código de barras no puede estar vacío" }),

	description: z
		.string({ error: "La descripción es requerida" })
		.max(255, {
			message: "La descripción no puede exceder los 255 caracteres",
		})
		.trim()
		.min(1, { message: "La descripción no puede estar vacía" }),

	costPrice: z
		.number({ error: "El precio de costo es requerido" })
		.positive({ message: "El precio de costo debe ser un número positivo" }),

	salePrice: z
		.number({ error: "El precio de venta es requerido" })
		.positive({ message: "El precio de venta debe ser un número positivo" }),

	wholesalePrice: z
		.number({ error: "El precio al por mayor es requerido" })
		.positive({
			message: "El precio al por mayor debe ser un número positivo",
		}),

	stock: z.number({ error: "El stock es requerido" }).positive({
		message: "El stock debe ser un número positivo",
	}),

	minStock: z.number({ error: "El stock mínimo es requerido" }).positive({
		message: "El stock mínimo debe ser un número positivo",
	}),
	categoryId: z.number().positive().nullish(),
});

export type BaseProductDto = z.infer<typeof baseProductDto>;
