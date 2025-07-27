import type { Product } from "@/modules/products/application/models";

export type TicketProduct = {
	barcode: string;
	id: number;
	description: string;
	salePrice: number;
	wholesalePrice: number;
	stock: number;
	currentPrice: number;
	currentStock: number;
	commonArt: boolean;
};

export type TicketType = "cash" | "credit";
