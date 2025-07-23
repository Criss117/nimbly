import type { FindManyPaymentsDto } from "@/clients/application/dtos/find-many-payments.dto";
import type { PaymentSummary } from "../entities/payment.entity";
import type { DeleteManyPaymentsByIdsDto } from "@/clients/application/dtos/delete-many-payments-by-ids.dto";

export interface PaymentsQueriesRepository {
	findManyByClient(meta: FindManyPaymentsDto): Promise<PaymentSummary[]>;
	findAllByIds(meta: DeleteManyPaymentsByIdsDto): Promise<PaymentSummary[]>;
}
