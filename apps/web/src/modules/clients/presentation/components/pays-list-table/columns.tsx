import { format } from "@formkit/tempo";
import type { ColumnDef } from "@tanstack/react-table";
import type { PaymentSummary } from "@nimbly/core/clients";
import { Checkbox } from "@/modules/shared/components/ui/checkbox";
import { formatCurrency } from "@/modules/shared/lib/utils";

export const columns: ColumnDef<PaymentSummary>[] = [
	{
		id: "selected",
		header: ({ table }) => {
			return (
				<div className="flex items-center justify-center">
					<Checkbox
						checked={
							table.getIsAllPageRowsSelected() ||
							(table.getIsSomePageRowsSelected() && "indeterminate")
						}
						onCheckedChange={(value) =>
							table.toggleAllPageRowsSelected(!!value)
						}
						aria-label="Select all"
					/>
				</div>
			);
		},
		cell: ({ row }) => {
			return (
				<div className="flex items-center justify-center">
					<Checkbox
						checked={row.getIsSelected()}
						onCheckedChange={(value) => row.toggleSelected(!!value)}
						aria-label="Select row"
					/>
				</div>
			);
		},
	},
	{
		accessorKey: "amount",
		header: "Monto",
		cell: ({ getValue }) => {
			const value = getValue() as number;
			return `$${formatCurrency(value)}`;
		},
	},
	{
		accessorKey: "createdAt",
		header: "Fecha",
		cell: ({ getValue }) => {
			const value = getValue() as Date;
			return format({
				date: value,
				format: "long",
				locale: "es-ES",
			});
		},
	},
	// {
	// 	id: "actions",
	// 	header: "Acciones",
	// 	cell: ({ row }) => {
	// 		return (
	// 			<div className="flex justify-center">
	// 				<DeletePayments
	// 					clientId={row.original.clientId}
	// 					ids={[row.original.id]}
	// 					variant="icon"
	// 				/>
	// 			</div>
	// 		);
	// 	},
	// },
];
