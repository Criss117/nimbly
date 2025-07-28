export interface CategorySummary {
	id: number;
	name: string;
	description: string;
}

export interface CategoryDetail {
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date | null;
	id: number;
	name: string;
	description: string | null;
}
