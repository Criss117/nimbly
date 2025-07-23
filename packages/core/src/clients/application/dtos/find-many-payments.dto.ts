import { z } from "zod";
import { baseCursorDto } from "@/shared/value-objects/cursor.value-object";
import { limit } from "@/shared/value-objects/query.value-objects";
import { clientId } from "@/shared/value-objects/client.value-object";

export const findManyPaymentsDto = z.object({
	cursor: baseCursorDto.nullish(),
	limit: limit,
	clientId: clientId,
});

export type FindManyPaymentsDto = z.infer<typeof findManyPaymentsDto>;
