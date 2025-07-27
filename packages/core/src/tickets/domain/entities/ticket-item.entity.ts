export interface TicketItemDetail {
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date | null;
	id: number;
	productId: number;
	ticketId: number;
	description: string;
	price: number;
	quantity: number;
	subtotal: number;
}
