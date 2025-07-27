import type { TicketStatus } from "@/modules/sales/application/models/schemas";
import { StatusBadge } from "@/modules/shared/components/status-badge";
import { formatCurrency } from "@/modules/shared/lib/utils";
import { format } from "@formkit/tempo";
import type { TicketDetail } from "@nimbly/core/tickets";
import type { ColumnDef } from "@tanstack/react-table";
import { Actions } from "./actions";

export const columns: ColumnDef<TicketDetail>[] = [
	{
		accessorKey: "id",
		header: "ID",
	},
	{
		accessorKey: "createdAt",
		header: "Fecha",
		cell: ({ getValue }) => {
			const date = getValue() as Date;

			return format({
				date,
				format: "long",
				locale: "es-ES",
			});
		},
	},
	{
		accessorKey: "status",
		header: "Estado",
		cell: ({ getValue }) => {
			const status = getValue() as TicketStatus;

			return <StatusBadge value={status} />;
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
		header: "Total pagado",
		cell: ({ getValue }) => {
			return formatCurrency(getValue() as number);
		},
	},
	{
		id: "actions",
		header: "",
		cell: ({ row }) => (
			<Actions.Menu>
				<Actions.TicketItemsList ticket={row.original} />
				{row.original.status !== "unpaid" || !row.original.clientId ? (
					<Actions.CanontDeleteTicket />
				) : (
					<Actions.DeleteTicket
						clientId={row.original.clientId}
						ticketId={row.original.id}
					/>
				)}
			</Actions.Menu>
		),
	},
];
