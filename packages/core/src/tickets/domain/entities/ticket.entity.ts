import type { PayStatus } from "@/clients/domain/entities/installment.entity";
import type { TicketItemDetail } from "./ticket-item.entity";

export interface TicketDetail {
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date;
	id: number;
	clientId: string;
	total: number;
	totalPaid: number;
	status: PayStatus;
	payType: "cash" | "credit";
	notes: string | null;
	items: TicketItemDetail[];
}

export interface TicketSummary {
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date;
	id: number;
	clientId: string;
	total: number;
	totalPaid: number;
	status: PayStatus;
	payType: "cash" | "credit";
	notes: string;
}
