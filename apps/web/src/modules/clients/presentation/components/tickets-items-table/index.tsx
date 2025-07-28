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
import type { TicketItemDetail } from "@nimbly/core/tickets";

interface RootProps {
	children: React.ReactNode;
	values: {
		items: TicketItemDetail[];
	};
}

interface Context {
	table: TableType<TicketItemDetail>;
	items: TicketItemDetail[];
}

const TicketsItemsTableContext = createContext<Context | null>(null);

function useTicketItemsTable() {
	const context = use(TicketsItemsTableContext);

	if (context === null) {
		throw new Error(
			"useTicketItemsTable must be used within a ProductsTableProvider",
		);
	}

	return context;
}

function Root({ children, values }: RootProps) {
	const { items } = values;
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
		<TicketsItemsTableContext.Provider
			value={{
				items,
				table,
			}}
		>
			{children}
		</TicketsItemsTableContext.Provider>
	);
}

function TableContainer({ children }: { children: React.ReactNode }) {
	return <Table>{children}</Table>;
}

function Header() {
	const { table } = useTicketItemsTable();

	return <DataTable.Header table={table} />;
}

function Body() {
	const { table } = useTicketItemsTable();

	return <DataTable.Body table={table} columns={columns} />;
}

export const TicketItemsTable = {
	Root,
	Header,
	useTicketItemsTable,
	Body,
	TableContainer,
};
