import { format } from "@formkit/tempo";
import type { ColumnDef } from "@tanstack/react-table";
import type {
	InstallmentModality,
	InstallmentPlanDetail,
} from "@nimbly/core/clients";

import { Actions } from "./actions";
import { cn, formatCurrency } from "@/modules/shared/lib/utils";
import { Badge } from "@/modules/shared/components/ui/badge";
import { ticketStatusBadge } from "@/modules/shared/lib/badge";
import { translateModality } from "@/modules/shared/lib/translations";
import type { TicketStatus } from "@/modules/sales/application/models/schemas";

export const columns: ColumnDef<InstallmentPlanDetail>[] = [
	{
		accessorKey: "id",
		header: "ID",
	},
	{
		accessorKey: "createdAt",
		header: "Fecha",
		cell: ({ getValue }) => {
			const createdAt = getValue() as Date;
			return (
				<span>
					{format({
						date: createdAt,
						format: "full",
						locale: "es-ES",
					})}
				</span>
			);
		},
	},
	{
		accessorKey: "status",
		header: "Estado",
		cell: ({ getValue }) => {
			const status = ticketStatusBadge(getValue() as TicketStatus);

			return (
				<Badge
					className={cn(
						"w-1/2 rounded-full flex justify-start mx-auto",
						status.class,
					)}
				>
					<status.Icon />
					{status.label}
				</Badge>
			);
		},
	},

	{
		accessorKey: "modality",
		header: "Modalidad",
		cell: ({ getValue }) => {
			const modality = getValue() as InstallmentModality;
			return (
				<p className="font-semibold text-center">
					{translateModality(modality)}
				</p>
			);
		},
	},
	{
		accessorKey: "total",
		header: "Total",
		cell: ({ getValue }) => {
			return formatCurrency(getValue() as number);
		},
	},
	{
		accessorKey: "totalPaid",
		header: "Total Pagado",
		cell: ({ getValue }) => {
			return formatCurrency(getValue() as number);
		},
	},
	{
		accessorKey: "numberOfInstallments",
		header: "Número de cuotas",
	},
	{
		id: "installmentsPaid",
		header: "Cuotas Pagadas",
		cell: ({ row }) => {
			const data = row.original;

			const installmentsPaid = data.installments.filter(
				(i) => i.status === "paid",
			).length;

			return (
				<p className="font-semibold text-center">
					{installmentsPaid}/{data.numberOfInstallments}
				</p>
			);
		},
	},
	{
		id: "actions",
		header: "",
		cell: ({ row }) => (
			<Actions.Menu>
				<Actions.PaymentsList values={row.original} />
			</Actions.Menu>
		),
	},
];
