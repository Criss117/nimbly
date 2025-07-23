import { baseCursorDto } from "@/shared/value-objects/cursor.value-object";
import { limit, searchQuery } from "@/shared/value-objects/query.value-objects";
import { z } from "zod";

export const findManyCategoriesDto = z.object({
	limit: limit,
	searchQuery: searchQuery.nullish(),
	cursor: baseCursorDto,
});

export type FindManyCategoriesDto = z.infer<typeof findManyCategoriesDto>;
