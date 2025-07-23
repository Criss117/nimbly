import { and, eq, inArray } from "drizzle-orm";
import type DBClient from "@nimbly/db";
import { schemas, type TX } from "@nimbly/db";
import type { DeleteManyPaymentsByIdsDto } from "@/clients/application/dtos/delete-many-payments-by-ids.dto";
import type { PayDebtDto } from "@/clients/application/dtos/pay-debt.dto";
import type { PaymentsCommandsRepository } from "@/clients/domain/repositories/payments-commands.repository";

const payments = schemas.tables.payments;

export class PaymentsCommandsRepositoryImpl
	implements PaymentsCommandsRepository
{
	constructor(private readonly db: DBClient["client"]) {}

	public async createPayment(data: PayDebtDto, tx?: TX): Promise<void> {
		const db = tx ?? this.db;

		await db.insert(payments).values({
			amount: data.amount,
			clientId: data.clientId,
		});
	}

	public async deleteManyByIds(
		meta: DeleteManyPaymentsByIdsDto,
		tx?: TX,
	): Promise<void> {
		const { ids, clientId } = meta;

		const db = tx ?? this.db;

		await db
			.update(payments)
			.set({
				isActive: false,
				deletedAt: new Date(),
			})
			.where(and(inArray(payments.id, ids), eq(payments.clientId, clientId)));
	}

	public async deleteAllByClient(clientId: string, tx?: TX): Promise<void> {
		const db = tx ?? this.db;

		await db
			.update(payments)
			.set({
				isActive: false,
				deletedAt: new Date(),
			})
			.where(eq(payments.clientId, clientId));
	}
}
