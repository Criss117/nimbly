import { formatCurrency } from "@/modules/shared/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import type { ClientSummary } from "@nimbly/core/clients";
import { Button } from "@/modules/shared/components/ui/button";
import { Link } from "@tanstack/react-router";
import { User2Icon } from "lucide-react";

export const columns: ColumnDef<ClientSummary>[] = [
	{
		accessorKey: "clientCode",
		header: "Código",
	},
	{
		accessorKey: "fullName",
		header: "Nombre",
	},
	{
		accessorKey: "phone",
		header: "Teléfono",
		cell: ({ getValue }) => {
			const value = getValue() as string | null;
			return <span>{value || "-"}</span>;
		},
	},
	{
		accessorKey: "email",
		header: "Email",
		cell: ({ getValue }) => {
			const value = getValue() as string | null;
			return <span>{value || "-"}</span>;
		},
	},
	{
		accessorKey: "address",
		header: "Dirección",
		cell: ({ getValue }) => {
			const value = getValue() as string | null;
			return <span>{value || "-"}</span>;
		},
	},
	{
		accessorKey: "creditLimit",
		header: "Límite de crédito",
		cell: ({ getValue }) => {
			const value = getValue() as number;
			return <span>{formatCurrency(value)}</span>;
		},
	},
	{
		id: "actions",
		header: "Acciones",
		cell: ({ row }) => {
			const client = row.original as ClientSummary;

			return (
				<Button asChild variant="link">
					<Link
						to="/dashboard/clients/$clientid"
						params={{
							clientid: client.id,
						}}
					>
						<User2Icon />
						Ver detalles
					</Link>
				</Button>
			);
		},
	},
];
