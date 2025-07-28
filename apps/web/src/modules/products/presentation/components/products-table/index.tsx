import { createContext, use, useState } from "react";
import type { ProductDetail } from "@nimbly/core/products";
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

interface RootProps {
	children: React.ReactNode;
	values: {
		items: ProductDetail[];
		isPending?: boolean;
		limit: number;
		hasNextPage: boolean;
		fetchNextPage: (callback: () => void) => void;
		setLimit: (value: number) => void;
	};
}

interface Context {
	table: TableType<ProductDetail>;
	items: ProductDetail[];
	isPending?: boolean;
	limit: number;
	hasNextPage: boolean;
	setLimit: (value: number) => void;
	setNextPage: () => void;
	setPreviousPage: () => void;
}

const ProductsTableContext = createContext<Context | null>(null);

function useProductsTable() {
	const context = use(ProductsTableContext);

	if (context === null) {
		throw new Error(
			"useProductsTable must be used within a ProductsTableProvider",
		);
	}

	return context;
}

function Root({ children, values }: RootProps) {
	const { items, limit, isPending, hasNextPage, fetchNextPage, setLimit } =
		values;
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
		<ProductsTableContext.Provider
			value={{
				items,
				table,
				isPending,
				limit,
				hasNextPage,
				setNextPage,
				setLimit,
				setPreviousPage,
			}}
		>
			{children}
		</ProductsTableContext.Provider>
	);
}

function TableContainer({ children }: { children: React.ReactNode }) {
	return <Table>{children}</Table>;
}

function Header() {
	const { table } = useProductsTable();

	return <DataTable.Header table={table} />;
}

function Body() {
	const { table, isPending, limit } = useProductsTable();

	if (isPending) {
		return (
			<DataTable.BodySkeleton length={limit} columnsLength={columns.length} />
		);
	}

	return <DataTable.Body table={table} columns={columns} />;
}

function Nav() {
	const { table, hasNextPage, setNextPage, setPreviousPage } =
		useProductsTable();

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

function Limit() {
	const { setLimit, limit } = useProductsTable();

	return <DataTable.Limit limit={limit} setLimit={setLimit} />;
}

export const ProductsTable = {
	Root,
	Header,
	useProductsTable,
	Body,
	Nav,
	TableContainer,
	Limit,
};
