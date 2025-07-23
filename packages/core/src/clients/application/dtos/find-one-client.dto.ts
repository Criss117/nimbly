import { z } from "zod";
import {
	clientCode,
	clientId,
} from "@/shared/value-objects/client.value-object";

export const findOneClientByDto = z.object({
	clientId: clientId.nullish(),
	clientCode: clientCode.nullish(),
});

export type FindOneClientByDto = z.infer<typeof findOneClientByDto>;
