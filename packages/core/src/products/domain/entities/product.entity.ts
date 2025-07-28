import type { CategorySummary } from "./category.entity";

export interface ProductSummary {
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date | null;
	id: number;
	barcode: string | null;
	description: string;
	costPrice: number;
	salePrice: number;
	wholesalePrice: number;
	stock: number;
	minStock: number;
	categoryId: number | null;
	quantitySold: number;
}

export interface ProductDetail {
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date | null;
	id: number;
	barcode: string | null;
	description: string;
	costPrice: number;
	salePrice: number;
	wholesalePrice: number;
	stock: number;
	minStock: number;
	categoryId: number | null;
	category: CategorySummary | null;
	quantitySold: number;
}
