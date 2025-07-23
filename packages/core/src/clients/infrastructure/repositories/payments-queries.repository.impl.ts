import { and, desc, eq, inArray, lte, or, sql } from "drizzle-orm";
import type DBClient from "@nimbly/db";
import { schemas } from "@nimbly/db";
import type { PaymentsQueriesRepository } from "@/clients/domain/repositories/payments-queries.repository";
import type { DeleteManyPaymentsByIdsDto } from "@/clients/application/dtos/delete-many-payments-by-ids.dto";
import type { FindManyPaymentsDto } from "@/clients/application/dtos/find-many-payments.dto";
import type { PaymentSummary } from "@/clients/domain/entities/payment.entity";

const payments = schemas.tables.payments;

export class PaymentsQueriesRepositoryImpl
	implements PaymentsQueriesRepository
{
	constructor(private readonly db: DBClient["client"]) {}

	findManyByClient(meta: FindManyPaymentsDto): Promise<PaymentSummary[]> {
		const { clientId, cursor, limit } = meta;

		return this.db
			.select({
				id: payments.id,
				clientId: payments.clientId,
				amount: payments.amount,
				createdAt: payments.createdAt,
				note: payments.note,
			})
			.from(payments)
			.where(
				and(
					or(
						cursor.createdAt
							? lte(payments.createdAt, cursor.createdAt)
							: sql`true`,
						and(
							cursor.createdAt
								? eq(payments.createdAt, cursor.createdAt)
								: sql`true`,
							cursor.lastId ? lte(payments.id, cursor.lastId) : sql`true`,
						),
					),

					eq(payments.clientId, clientId),
					eq(payments.isActive, true),
				),
			)
			.limit(limit + 1)
			.orderBy(desc(payments.createdAt));
	}

	findAllByIds(meta: DeleteManyPaymentsByIdsDto): Promise<PaymentSummary[]> {
		const { clientId, ids } = meta;

		return this.db
			.select({
				id: payments.id,
				amount: payments.amount,
				clientId: payments.clientId,
				note: payments.note,
				createdAt: payments.createdAt,
			})
			.from(payments)
			.where(
				and(
					eq(payments.isActive, true),
					eq(payments.clientId, clientId),
					inArray(payments.id, ids),
				),
			);
	}
}
