import type { PayStatus } from "@/clients/domain/entities/installment.entity";
import type { TicketItemDetail } from "./ticket-item.entity";

export interface TicketDetail {
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date | null;
	id: number;
	clientId: string | null;
	total: number;
	totalPaid: number;
	status: PayStatus;
	payType: "cash" | "credit" | null;
	notes: string | null;
	items: TicketItemDetail[];
}

export interface TicketSummary {
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date | null;
	id: number;
	clientId: string | null;
	total: number;
	totalPaid: number;
	status: PayStatus;
	payType: "cash" | "credit" | null;
	notes: string | null;
}
