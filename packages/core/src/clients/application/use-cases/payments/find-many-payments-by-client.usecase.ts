import type { FindManyPaymentsDto } from "../../dtos/find-many-payments.dto";
import type {
	BaseCursorDto,
	Paginated,
} from "@/shared/value-objects/cursor.value-object";
import { calculateNextCursor } from "@/shared/utils/next-cursor";
import type { PaymentsQueriesRepository } from "@/clients/domain/repositories/payments-queries.repository";
import type { PaymentSummary } from "@/clients/domain";

export class FindManyPaymentsByClientUseCase {
	constructor(
		private readonly paymentsQueriesRepository: PaymentsQueriesRepository,
	) {}

	public async execute(
		meta: FindManyPaymentsDto,
	): Promise<Paginated<PaymentSummary, BaseCursorDto>> {
		const payments =
			await this.paymentsQueriesRepository.findManyByClient(meta);

		const { hasMore, items, lastItem } = calculateNextCursor(
			payments,
			meta.limit,
		);

		const nextCursor = {
			lastId: hasMore ? lastItem.id : null,
			createdAt: hasMore ? lastItem.createdAt : null,
		};

		return {
			items,
			nextCursor,
		};
	}
}
