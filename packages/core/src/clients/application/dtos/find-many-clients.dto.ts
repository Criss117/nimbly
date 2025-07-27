import { clientsCursor } from "@/shared/value-objects/client.value-object";
import { limit, searchQuery } from "@/shared/value-objects/query.value-objects";
import { z } from "zod";

export const findManyClientsDto = z.object({
	cursor: clientsCursor.nullish(),
	limit: limit,
	searchQuery: searchQuery,
});

export type FindManyClientsDto = z.infer<typeof findManyClientsDto>;
