import { z } from "zod";
import { baseCursorDto } from "@/shared/value-objects/cursor.value-object";
import { limit } from "@/shared/value-objects/query.value-objects";
import { clientId } from "@/shared/value-objects/client.value-object";

export const findManyInstallmentsDto = z.object({
	cursor: baseCursorDto,
	limit: limit,
	clientId: clientId,
});

export type FindManyInstallmentsDto = z.infer<typeof findManyInstallmentsDto>;
