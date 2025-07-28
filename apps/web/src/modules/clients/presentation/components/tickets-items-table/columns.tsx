import type { ColumnDef } from "@tanstack/react-table";
import type { TicketItemDetail } from "@nimbly/core/tickets";

import { Checkbox } from "@/modules/shared/components/ui/checkbox";
import { formatCurrency } from "@/modules/shared/lib/utils";

export const columns: ColumnDef<TicketItemDetail>[] = [
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
		accessorKey: "description",
		header: "Descripción",
	},
	{
		accessorKey: "quantity",
		header: "Cantidad",
	},
	{
		accessorKey: "subtotal",
		header: "Subtotal",
		cell: ({ getValue }) => {
			const value = getValue() as number;
			return `$${formatCurrency(value)}`;
		},
	},
];
