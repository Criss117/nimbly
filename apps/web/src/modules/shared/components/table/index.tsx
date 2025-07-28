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
import { Label } from "../ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

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

interface LimitProps {
	limit: number;
	setLimit: (value: number) => void;
}

function Header<T>({ table }: HeaderProps<T>) {
	return (
		<TableHeader>
			{table.getHeaderGroups().map((headerGroup) => (
				<TableRow key={headerGroup.id}>
					{headerGroup.headers.map((header) => {
						return (
							<TableHead
								key={header.id}
								style={{
									width: header.getSize(),
								}}
							>
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
							<TableCell
								key={cell.id}
								className="truncate"
								style={{
									width: cell.column.columnDef.size,
									maxWidth: cell.column.columnDef.maxSize,
								}}
							>
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

function Limit({ limit, setLimit }: LimitProps) {
	return (
		<div className="hidden items-center gap-2 lg:flex">
			<Label htmlFor="rows-per-page" className="text-sm font-medium">
				Filas por página
			</Label>
			<Select
				value={limit.toString()}
				onValueChange={(value) => {
					setLimit(Number(value));
				}}
			>
				<SelectTrigger size="sm" className="w-20" id="rows-per-page">
					<SelectValue placeholder={limit.toString()} />
				</SelectTrigger>
				<SelectContent side="top">
					{[10, 20, 30, 40, 50].map((pageSize) => (
						<SelectItem key={pageSize} value={`${pageSize}`}>
							{pageSize}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}

export const DataTable = {
	Body,
	BodySkeleton,
	Header,
	Limit,
};
