import z from "zod";

export const updateStockDto = z.object({
	quantity: z.number().min(1).max(100),
	productId: z.number(),
	byReturn: z.boolean().optional(),
});

export type UpdateStockDto = z.infer<typeof updateStockDto>;
