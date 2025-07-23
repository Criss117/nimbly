export interface CategorySummary {
	id: number;
	name: string;
	description: string;
}

export interface CategoryDetail {
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date;
	id: number;
	name: string;
	description: string;
}
