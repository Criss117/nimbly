import { createContext, use, useState } from "react";
import {
	getCoreRowModel,
	useReactTable,
	type RowSelectionState,
	type Table as TableType,
} from "@tanstack/react-table";

import { columns } from "./columns";
import { Table } from "@/modules/shared/components/ui/table";
import { DataTable } from "@/modules/shared/components/table";
import type { PaymentSummary } from "@nimbly/core/clients";

interface RootProps {
	children: React.ReactNode;
	values: {
		items: PaymentSummary[];
		isPending?: boolean;
		limit: number;
	};
}

interface Context {
	table: TableType<PaymentSummary>;
	items: PaymentSummary[];
	isPending?: boolean;
	limit: number;
}

const PaysListTableContext = createContext<Context | null>(null);

function usePaysListTable() {
	const context = use(PaysListTableContext);

	if (context === null) {
		throw new Error(
			"usePaysListTable must be used within a ProductsTableProvider",
		);
	}

	return context;
}

function Root({ children, values }: RootProps) {
	const { items, limit, isPending } = values;
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

	const table = useReactTable({
		data: items,
		columns: columns,
		getCoreRowModel: getCoreRowModel(),
		onRowSelectionChange: setRowSelection,
		state: {
			rowSelection,
		},
	});

	return (
		<PaysListTableContext.Provider
			value={{
				items,
				table,
				isPending,
				limit,
			}}
		>
			{children}
		</PaysListTableContext.Provider>
	);
}

function TableContainer({ children }: { children: React.ReactNode }) {
	return <Table>{children}</Table>;
}

function Header() {
	const { table } = usePaysListTable();

	return <DataTable.Header table={table} />;
}

function Body() {
	const { table, isPending, limit } = usePaysListTable();

	if (isPending) {
		return (
			<DataTable.BodySkeleton length={limit} columnsLength={columns.length} />
		);
	}

	return <DataTable.Body table={table} columns={columns} />;
}

export const PaysListTable = {
	Root,
	Header,
	usePaysListTable,
	Body,
	TableContainer,
};
