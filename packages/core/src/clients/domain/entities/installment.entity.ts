import type { schemas } from "@nimbly/db";

export type InstallmentModality =
	(typeof schemas.shared.installmentModality)[number];
export type PayStatus = (typeof schemas.shared.payStatus)[number];

export interface InstallmentPayment {
	id: number;
	status: PayStatus;
	subtotalPaid: number;
	subtotal: number;
	installmentNumber: number;
	dueDate: Date;
	createdAt: Date;
}

export interface InstallmentPlanDetail {
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date;
	id: number;
	clientId: string;
	numberOfInstallments: number;
	installmentsPaid: number;
	modality: InstallmentModality;
	totalPaid: number;
	total: number;
	status: PayStatus;
	installments: InstallmentPayment[];
}

export interface InstallmentPlanSummary {
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date;
	id: number;
	clientId: string;
	numberOfInstallments: number;
	installmentsPaid: number;
	modality: InstallmentModality;
	totalPaid: number;
	total: number;
	status: PayStatus;
}
