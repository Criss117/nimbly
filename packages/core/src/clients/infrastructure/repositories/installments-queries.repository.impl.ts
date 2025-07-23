import { and, desc, eq, getTableColumns, lte, not, or, sql } from "drizzle-orm";
import { verifyInstallmentPaymentSchema } from "../mappers/installments-payments.mapper";
import type { InstallmentsQueriesRepository } from "@/clients/domain/repositories/installments-queries.repository";
import { schemas, type TX } from "@nimbly/db";
import type DBClient from "@nimbly/db";
import type { FindManyInstallmentsDto } from "@/clients/application/dtos/find-many-installments.dto";
import type { InstallmentPlanDetail } from "@/clients/domain/entities/installment.entity";
import type { ClientId } from "@/shared/value-objects/client.value-object";

const installmentPlans = schemas.tables.installmentPlans;
const installmentPayments = schemas.tables.installmentPayments;

export class InstallmentsQueriesRepositoryImpl
	implements InstallmentsQueriesRepository
{
	constructor(private readonly db: DBClient["client"]) {}

	public async findAllBy(
		meta: FindManyInstallmentsDto,
		tx?: TX,
	): Promise<InstallmentPlanDetail[]> {
		const { clientId, cursor, limit } = meta;
		const db = tx ?? this.db;

		const plans = await db
			.select({
				...getTableColumns(installmentPlans),
				installments: sql<string>`json_group_array(
           	json_object (
          		'id', ${installmentPayments.id},
              'status', ${installmentPayments.status},
              'subtotal', ${installmentPayments.subtotal},
              'subtotalPaid', ${installmentPayments.subtotalPaid},
              'installmentNumber', ${installmentPayments.installmentNumber},
              'createdAt', ${installmentPayments.createdAt},
              'dueDate', ${installmentPayments.dueDate}
           	)
        )`,
			})
			.from(installmentPlans)
			.innerJoin(
				installmentPayments,
				eq(installmentPlans.id, installmentPayments.planId),
			)
			.where(
				and(
					or(
						cursor.createdAt
							? lte(installmentPlans.createdAt, cursor.createdAt)
							: sql`true`,
						and(
							cursor.createdAt
								? eq(installmentPlans.createdAt, cursor.createdAt)
								: sql`true`,
							cursor.lastId
								? lte(installmentPlans.id, cursor.lastId)
								: sql`true`,
						),
					),

					eq(installmentPlans.clientId, clientId),
					eq(installmentPlans.isActive, true),
				),
			)
			.orderBy(desc(installmentPlans.createdAt))
			.limit(limit + 1)
			.groupBy(installmentPlans.id);

		return plans.map((p) => {
			const { installments, ...rest } = p;

			const { data, success, error } =
				verifyInstallmentPaymentSchema(installments);

			if (!data || !success) {
				throw new Error(error.message, {
					cause: "INTERNAL_SERVER_ERROR",
				});
			}

			return {
				...rest,
				installments: data.sort(
					(a, b) => a.installmentNumber - b.installmentNumber,
				),
			};
		});
	}

	public async findActivePlan(
		clientId: ClientId,
		tx?: TX,
	): Promise<InstallmentPlanDetail> {
		const db = tx ?? this.db;

		const [plan] = await db
			.select({
				...getTableColumns(installmentPlans),
				installments: sql<string>`json_group_array(
           	json_object (
          		'id', ${installmentPayments.id},
              'status', ${installmentPayments.status},
              'subtotal', ${installmentPayments.subtotal},
              'subtotalPaid', ${installmentPayments.subtotalPaid},
              'installmentNumber', ${installmentPayments.installmentNumber},
              'createdAt', ${installmentPayments.createdAt},
              'dueDate', ${installmentPayments.dueDate}
           	)
        )`,
			})
			.from(installmentPlans)
			.innerJoin(
				installmentPayments,
				eq(installmentPlans.id, installmentPayments.planId),
			)
			.where(
				and(
					eq(installmentPlans.clientId, clientId),
					eq(installmentPlans.isActive, true),
					not(eq(installmentPlans.status, "paid")),
				),
			);

		if (!plan || !plan.id) {
			return null;
		}

		const { installments, ...rest } = plan;

		const { data, success, error } =
			verifyInstallmentPaymentSchema(installments);

		if (!data || !success) {
			throw new Error(error.message, {
				cause: "INTERNAL_SERVER_ERROR",
			});
		}

		return {
			...rest,
			installments: data.sort(
				(a, b) => a.installmentNumber - b.installmentNumber,
			),
		};
	}

	public async totalDebt(clientId: ClientId): Promise<number> {
		const [plan] = await this.db
			.select({
				total: installmentPlans.total,
				totalPaid: installmentPlans.totalPaid,
			})
			.from(installmentPlans)
			.where(
				and(
					eq(installmentPlans.clientId, clientId),
					eq(installmentPlans.isActive, true),
					not(eq(installmentPlans.status, "paid")),
				),
			);

		return plan.total - plan.totalPaid;
	}
}
