import { createContext, use, useState } from "react";
import {
	getCoreRowModel,
	getPaginationRowModel,
	useReactTable,
	type Table as TableType,
} from "@tanstack/react-table";

import { columns } from "./columns";
import { Table } from "@/modules/shared/components/ui/table";
import { Button } from "@/modules/shared/components/ui/button";
import { DataTable } from "@/modules/shared/components/table";
import type { InstallmentPlanDetail } from "@nimbly/core/clients";

interface RootProps {
	children: React.ReactNode;
	values: {
		items: InstallmentPlanDetail[];
		isPending?: boolean;
		limit: number;
		hasNextPage: boolean;
		fetchNextPage: (callback: () => void) => void;
	};
}

interface Context {
	table: TableType<InstallmentPlanDetail>;
	items: InstallmentPlanDetail[];
	isPending?: boolean;
	limit: number;
	hasNextPage: boolean;
	setNextPage: () => void;
	setPreviousPage: () => void;
}

const InstallmentsTableContext = createContext<Context | null>(null);

function useInstallmentsTable() {
	const context = use(InstallmentsTableContext);

	if (context === null) {
		throw new Error(
			"useInstallmentsTable must be used within a ProductsTableProvider",
		);
	}

	return context;
}

function Root({ children, values }: RootProps) {
	const { items, limit, isPending, hasNextPage, fetchNextPage } = values;
	const [pagination, setPagination] = useState({
		pageSize: limit,
		pageIndex: 0,
	});

	const table = useReactTable({
		data: items,
		columns: columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		state: {
			pagination,
		},
	});

	const setNextPage = () => {
		if (table.getCanNextPage()) {
			setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex + 1 }));
			return;
		}

		fetchNextPage(() =>
			setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex + 1 })),
		);
	};

	const setPreviousPage = () => {
		setPagination((prev) => {
			if (prev.pageIndex === 0) {
				return prev;
			}

			return { ...prev, pageIndex: prev.pageIndex - 1 };
		});
	};

	return (
		<InstallmentsTableContext.Provider
			value={{
				items,
				table,
				isPending,
				limit,
				hasNextPage,
				setNextPage,
				setPreviousPage,
			}}
		>
			{children}
		</InstallmentsTableContext.Provider>
	);
}

function TableContainer({ children }: { children: React.ReactNode }) {
	return <Table>{children}</Table>;
}

function Header() {
	const { table } = useInstallmentsTable();

	return <DataTable.Header table={table} />;
}

function Body() {
	const { table, isPending, limit } = useInstallmentsTable();

	if (isPending) {
		return (
			<DataTable.BodySkeleton length={limit} columnsLength={columns.length} />
		);
	}

	return <DataTable.Body table={table} columns={columns} />;
}

function Nav() {
	const { table, hasNextPage, setNextPage, setPreviousPage } =
		useInstallmentsTable();

	return (
		<div className="flex items-center justify-end space-x-2">
			<Button
				variant="outline"
				size="sm"
				onClick={() => setPreviousPage()}
				disabled={!table.getCanPreviousPage()}
			>
				Anterior
			</Button>
			<Button
				variant="outline"
				size="sm"
				onClick={setNextPage}
				disabled={!hasNextPage}
			>
				Siguiente
			</Button>
		</div>
	);
}

export const InstallmentsTable = {
	Root,
	Header,
	useInstallmentsTable,
	Body,
	Nav,
	TableContainer,
};
