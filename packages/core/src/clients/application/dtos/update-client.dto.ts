import { z } from "zod";
import { schemas } from "@nimbly/db";
import { clientId } from "@/shared/value-objects/client.value-object";
import { createClientDto } from "./create-client.dto";

export const updateClientDto = createClientDto.partial().extend({
	clientId: clientId,
	numberOfInstallments: z.number().min(1).max(36).int().nullish(),
	modality: z.enum(schemas.shared.installmentModality).nullish(),
});

export type UpdateClientDto = z.infer<typeof updateClientDto>;
