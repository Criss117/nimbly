import { createContext, use, useState } from "react";
import type { TicketDetail } from "@nimbly/core/tickets";
import {
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	useReactTable,
	type Table as TableType,
} from "@tanstack/react-table";
import { columns } from "./columns";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/modules/shared/components/ui/table";
import { Skeleton } from "@/modules/shared/components/ui/skeleton";
import { Button } from "@/modules/shared/components/ui/button";

interface RootProps {
	children: React.ReactNode;
	values: {
		items: TicketDetail[];
		isPending?: boolean;
		limit: number;
		hasNextPage: boolean;
		fetchNextPage: (callback: () => void) => void;
	};
}

interface Context {
	table: TableType<TicketDetail>;
	items: TicketDetail[];
	isPending?: boolean;
	limit: number;
	hasNextPage: boolean;
	setNextPage: () => void;
	setPreviousPage: () => void;
}

const TicketsTableContext = createContext<Context | null>(null);

function useTicketsTable() {
	const context = use(TicketsTableContext);

	if (context === null) {
		throw new Error(
			"useTicketsTable must be used within a ProductsTableProvider",
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
		<TicketsTableContext.Provider
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
		</TicketsTableContext.Provider>
	);
}

function TableContainer({ children }: { children: React.ReactNode }) {
	return <Table>{children}</Table>;
}

function Header() {
	const { table } = useTicketsTable();

	return (
		<TableHeader>
			{table.getHeaderGroups().map((headerGroup) => (
				<TableRow key={headerGroup.id}>
					{headerGroup.headers.map((header) => {
						return (
							<TableHead key={header.id}>
								{header.isPlaceholder
									? null
									: flexRender(
											header.column.columnDef.header,
											header.getContext(),
										)}
							</TableHead>
						);
					})}
				</TableRow>
			))}
		</TableHeader>
	);
}

function Body() {
	const { table, isPending, limit } = useTicketsTable();

	if (isPending) {
		return <BodySkeleton length={limit} />;
	}

	return (
		<TableBody>
			{table.getRowModel().rows?.length ? (
				table.getRowModel().rows.map((row) => (
					<TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
						{row.getVisibleCells().map((cell) => (
							<TableCell key={cell.id}>
								{flexRender(cell.column.columnDef.cell, cell.getContext())}
							</TableCell>
						))}
					</TableRow>
				))
			) : (
				<TableRow>
					<TableCell colSpan={columns.length} className="h-24 text-center">
						Sin resultados
					</TableCell>
				</TableRow>
			)}
		</TableBody>
	);
}

function BodySkeleton({ length = 10 }: { length?: number }) {
	return (
		<TableBody>
			{Array.from({ length }).map((_, index) => (
				<TableRow key={index.toString()}>
					{Array.from({ length: columns.length }).map((_, index) => (
						<TableCell key={index.toString()}>
							<Skeleton className="h-4 w-full" />
						</TableCell>
					))}
				</TableRow>
			))}
		</TableBody>
	);
}

function Nav() {
	const { table, hasNextPage, setNextPage, setPreviousPage } =
		useTicketsTable();

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

export const TicketsTable = {
	Root,
	useTicketsTable,
	TableContainer,
	Header,
	Body,
	BodySkeleton,
	Nav,
};
