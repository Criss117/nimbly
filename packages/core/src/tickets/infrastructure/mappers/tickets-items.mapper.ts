import z from "zod";
import type { TicketItemDetail } from "@/tickets/domain/entities/ticket-item.entity";

export const ticketItemMapper = z.object({
	isActive: z.number().int().positive(),
	createdAt: z.number(), // Treating Date as timestamp number
	updatedAt: z.number(), // Treating Date as timestamp number
	deletedAt: z.number().nullish(), // Treating Date as timestamp number
	id: z.number().int().positive(),
	productId: z.number().int().positive(),
	ticketId: z.number().int().positive(),
	description: z.string(),
	price: z.number().nonnegative(),
	quantity: z.number().int().nonnegative(),
	subtotal: z.number().nonnegative(),
});

export function verifyTicketItemDto(toParse: string) {
	const { success, data, error } = z
		.array(ticketItemMapper)
		.safeParse(JSON.parse(toParse));

	const dataParsed: TicketItemDetail[] = data
		? data.map((p) => ({
				...p,
				updatedAt: new Date(p.updatedAt * 1000),
				deletedAt: p.deletedAt ? new Date(p.deletedAt * 1000) : null,
				createdAt: new Date(p.createdAt * 1000),
				isActive: p.isActive === 1,
			}))
		: [];

	return {
		success,
		data: dataParsed,
		error,
	};
}
