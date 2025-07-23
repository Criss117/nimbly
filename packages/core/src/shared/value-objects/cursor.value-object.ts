import { z } from "zod";

export const baseCursorDto = z.object({
	createdAt: z.date(),
	lastId: z.number(),
});

export type BaseCursorDto = z.infer<typeof baseCursorDto>;

export type Paginated<T, Y> = {
	items: T[];
	nextCursor?: Y;
};
