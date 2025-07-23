export interface TicketItemDetail {
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date;
	id: number;
	productId: number;
	ticketId: number;
	description: string;
	price: number;
	quantity: number;
	subtotal: number;
}
