import type { CategorySummary } from "./category.entity";

export interface ProductSummary {
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date;
	id: number;
	barcode: string;
	description: string;
	costPrice: number;
	salePrice: number;
	wholesalePrice: number;
	stock: number;
	minStock: number;
	categoryId: number;
}

export interface ProductDetail {
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date;
	id: number;
	barcode: string;
	description: string;
	costPrice: number;
	salePrice: number;
	wholesalePrice: number;
	stock: number;
	minStock: number;
	categoryId: number;
	category: CategorySummary | null;
}
