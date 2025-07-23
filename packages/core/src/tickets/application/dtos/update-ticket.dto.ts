import type { PayStatus } from "@/clients/domain/entities/installment.entity";

export type UpdateTotalPaidDto = {
	id: number;
	totalPaid: number;
	status: PayStatus;
};
