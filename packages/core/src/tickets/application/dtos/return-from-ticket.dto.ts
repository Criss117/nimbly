import z from "zod";
import { clientId } from "@/shared/value-objects/client.value-object";

export const returnFromTicketDto = z.object({
	ticketId: z.number(),
	clientId: clientId,
	ticketItemIds: z.array(z.number()).nonempty(),
});

export type ReturnFromTicketDto = z.infer<typeof returnFromTicketDto>;
