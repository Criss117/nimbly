import { z } from "zod";
import { payType } from "./schemas";
import { createTicketItemSchema } from "./create-ticket-items.schema";

export const createTicketSchema = z
	.object({
		payType: z.enum(payType, {
			error: "Selecciona un tipo de ticket",
		}),
		clientId: z
			.string({
				error: "Selecciona un cliente",
			})
			.nullish(),
		items: z
			.array(createTicketItemSchema, {
				error: "Agrega al menos un item",
			})
			.min(1, {
				message: "Agrega al menos un item",
			}),
	})
	.refine(
		(data) => {
			const isCredit = data.payType === "credit";
			const hasClient = !!data.clientId;

			return !(isCredit && !hasClient);
		},
		{
			message: "Selecciona un cliente para este tipo de crédito",
			path: ["clientId"],
		},
	);

export type CreateTicketSchema = z.infer<typeof createTicketSchema>;
