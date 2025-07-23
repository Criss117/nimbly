import { z } from "zod";
import { baseCursorDto } from "@/shared/value-objects/cursor.value-object";
import { limit, searchQuery } from "@/shared/value-objects/query.value-objects";

export const findManyProductsDto = z.object({
	limit: limit,
	searchQuery: searchQuery,
	cursor: baseCursorDto,
});

export type FindManyProductsDto = z.infer<typeof findManyProductsDto>;
