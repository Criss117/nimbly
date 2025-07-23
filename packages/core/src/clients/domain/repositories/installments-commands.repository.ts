import type { InsertInstallmentPlan } from "@/clients/application/dtos/create-installment-plan.dto";
import type { UpdateInstallmentPlanDto } from "@/clients/application/dtos/update-installment.dto";
import type { TX } from "@nimbly/db";

export interface InstallmentsCommandsRepository {
	createInstallmentPlan(data: InsertInstallmentPlan, tx?: TX): Promise<void>;
	updateInstallmentPlan(data: UpdateInstallmentPlanDto, tx?: TX): Promise<void>;
}
