import { z } from "zod";
import { createTicketItemDto } from "./create-ticket-item.dto";
import { schemas } from "@nimbly/db";

const { payType } = schemas.shared;

export const createTicketDto = z
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
			.array(createTicketItemDto, {
				error: "Agrega al menos un item",
			})
			.min(1, {
				message: "Agrega al menos un item",
			}),
		notes: z
			.string()
			.min(1, { message: "Cannot be empty" })
			.max(255, { message: "Maximum length is 255 characters" })
			.nullish(),
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

export type CreateTicketDto = z.infer<typeof createTicketDto>;
