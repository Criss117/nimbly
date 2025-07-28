import { formatCurrency } from "@/modules/shared/lib/utils";
import type { ProductDetail } from "@nimbly/core/products";
import type { ColumnDef } from "@tanstack/react-table";
import { ProductActions } from "./actions";

export const columns: ColumnDef<ProductDetail>[] = [
	{
		accessorKey: "barcode",
		header: "Codigo de barras",
		size: 150,
		maxSize: 150,
	},
	{
		accessorKey: "description",
		header: "Descripción",
		size: 200,
		maxSize: 200,
	},
	{
		accessorKey: "category",
		header: "Categoría",
		cell: ({ getValue }) => {
			const value = getValue() as {
				id: number;
				name: string;
			} | null;

			return <span>{value?.name ?? "-"}</span>;
		},
		size: 100,
		maxSize: 100,
	},
	{
		accessorKey: "costPrice",
		header: "Precio de costo",
		cell: ({ getValue }) => {
			const value = getValue() as number;
			return <span>{formatCurrency(value)}</span>;
		},
		size: 100,
		maxSize: 100,
	},
	{
		accessorKey: "salePrice",
		header: "Precio de venta",
		cell: ({ getValue }) => {
			const value = getValue() as number;
			return <span>{formatCurrency(value)}</span>;
		},
		size: 100,
		maxSize: 100,
	},
	{
		accessorKey: "wholesalePrice",
		header: "Precio mayoreo",
		cell: ({ getValue }) => {
			const value = getValue() as number;
			return <span>{formatCurrency(value)}</span>;
		},
		size: 100,
		maxSize: 100,
	},
	{
		accessorKey: "stock",
		header: "Stock",
		size: 50,
		maxSize: 50,
		cell: ({ getValue }) => {
			const value = getValue() as number;
			return <span className="text-right">{value}</span>;
		},
	},
	{
		accessorKey: "minStock",
		header: "Stock mínimo",
		size: 50,
		maxSize: 50,
	},
	{
		id: "actions",
		header: "Acciones",
		cell: ({ row }) => {
			const product = row.original as Omit<ProductDetail, "barcode"> & {
				barcode: string;
			};

			return <ProductActions product={product} />;
		},
		size: 100,
		maxSize: 100,
	},
];
