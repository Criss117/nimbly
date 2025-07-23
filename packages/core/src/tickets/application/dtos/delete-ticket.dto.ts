import { z } from "zod";

export const deleteTicketDto = z.object({
  clientId: z.string({
    error: "Selecciona un cliente",
  }),
  ticketId: z
    .number({
      error: "El ticket es requerido",
    })
    .min(1, { message: "El id del ticket debe ser mayor a 0" })
    .int(),
});

export type DeleteTicketDto = z.infer<typeof deleteTicketDto>;
