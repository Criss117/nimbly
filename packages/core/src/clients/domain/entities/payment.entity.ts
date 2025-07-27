export interface PaymentSummary {
	createdAt: Date;
	id: number;
	clientId: string;
	amount: number;
	note: string | null;
}
