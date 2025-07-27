import {
	flexRender,
	type ColumnDef,
	type Table as TableType,
} from "@tanstack/react-table";
import { Skeleton } from "../ui/skeleton";
import {
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/table";

interface BodyProps<T> {
	table: TableType<T>;
	columns: ColumnDef<T>[];
}

interface HeaderProps<T> {
	table: TableType<T>;
}

interface BodySkeletonProps {
	length?: number;
	columnsLength: number;
}

function Header<T>({ table }: HeaderProps<T>) {
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

function Body<T>({ columns, table }: BodyProps<T>) {
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

function BodySkeleton({ length = 10, columnsLength }: BodySkeletonProps) {
	return (
		<TableBody>
			{Array.from({ length }).map((_, index) => (
				<TableRow key={index.toString()}>
					{Array.from({ length: columnsLength }).map((_, index) => (
						<TableCell key={index.toString()}>
							<Skeleton className="h-4 w-full" />
						</TableCell>
					))}
				</TableRow>
			))}
		</TableBody>
	);
}

export const DataTable = {
	Body,
	BodySkeleton,
	Header,
};
