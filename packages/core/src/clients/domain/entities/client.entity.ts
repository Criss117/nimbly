import type { InstallmentModality } from "./installment.entity";

export interface ClientSummary {
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date;
	id: string;
	fullName: string;
	email: string;
	phone: string;
	address: string;
	creditLimit: number;
	clientCode: string;
	globalNumberOfInstallments: number;
	globalInstallmentModality: InstallmentModality;
}

export interface ClientDetail {
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date;
	id: string;
	fullName: string;
	email: string;
	phone: string;
	address: string;
	creditLimit: number;
	clientCode: string;
	globalNumberOfInstallments: number;
	globalInstallmentModality: InstallmentModality;
	totalTickets: number;
	totalTicketsUnpaid: number;
	totalTicketsPaid: number;
	totalDebt: number;
	totalInstallments: number;
	lastTicketDate: Date | null;
}
