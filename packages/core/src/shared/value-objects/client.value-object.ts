import { z } from "zod";

export const clientId = z.uuid({
	error: "El ID debe ser una cadena de texto",
});

export const clientCode = z
	.string({
		error: "El código debe ser una cadena de texto",
	})
	.min(2, "El código debe tener al menos 2 caracteres")
	.max(225, "El código no puede exceder los 225 caracteres");

export const clientsCursor = z.object({
	createdAt: z.date(),
	lastClientCode: z.string().max(100),
});

export type ClientId = z.infer<typeof clientId>;
export type ClientsCursor = z.infer<typeof clientsCursor>;
