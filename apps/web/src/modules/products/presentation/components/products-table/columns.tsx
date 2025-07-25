import { formatCurrency } from "@/modules/shared/lib/utils";
import type { ProductDetail } from "@nimbly/core/products";
import type { ColumnDef } from "@tanstack/react-table";
import { ProductActions } from "./actions";

export const columns: ColumnDef<ProductDetail>[] = [
	{
		accessorKey: "barcode",
		header: "Codigo de barras",
	},
	{
		accessorKey: "description",
		header: "Descripción",
	},
	{
		accessorKey: "category",
		header: "Categoría",
		cell: ({ getValue }) => {
			const value = getValue() as {
				id: number;
				name: string;
			} | null;
			return <span>{value?.name ?? "Sin categoría"}</span>;
		},
	},
	{
		accessorKey: "costPrice",
		header: "Precio de costo",
		cell: ({ getValue }) => {
			const value = getValue() as number;
			return <span>{formatCurrency(value)}</span>;
		},
	},
	{
		accessorKey: "salePrice",
		header: "Precio de venta",
		cell: ({ getValue }) => {
			const value = getValue() as number;
			return <span>{formatCurrency(value)}</span>;
		},
	},
	{
		accessorKey: "wholesalePrice",
		header: "Precio mayoreo",
		cell: ({ getValue }) => {
			const value = getValue() as number;
			return <span>{formatCurrency(value)}</span>;
		},
	},
	{
		accessorKey: "stock",
		header: "Stock",
	},
	{
		accessorKey: "minStock",
		header: "Stock mínimo",
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
	},
];
