import type { FindManyInstallmentsDto } from "@/clients/application/dtos/find-many-installments.dto";
import type { InstallmentPlanDetail } from "../entities/installment.entity";
import type { ClientId } from "@/shared/value-objects/client.value-object";
import type { TX } from "@nimbly/db";

export interface InstallmentsQueriesRepository {
	findAllBy(meta: FindManyInstallmentsDto): Promise<InstallmentPlanDetail[]>;
	findActivePlan(clientId: ClientId, tx?: TX): Promise<InstallmentPlanDetail>;
	totalDebt(clientId: ClientId): Promise<number>;
}
