import type { DeleteManyPaymentsByIdsDto } from "@/clients/application/dtos/delete-many-payments-by-ids.dto";
import type { PayDebtDto } from "@/clients/application/dtos/pay-debt.dto";
import type { TX } from "@nimbly/db";

export interface PaymentsCommandsRepository {
	createPayment(data: PayDebtDto, tx?: TX): Promise<void>;
	deleteManyByIds(meta: DeleteManyPaymentsByIdsDto, tx?: TX): Promise<void>;
	deleteAllByClient(clientId: string, tx?: TX): Promise<void>;
}
