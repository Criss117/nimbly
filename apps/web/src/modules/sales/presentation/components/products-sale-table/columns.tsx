import { Trash2Icon } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import { useTicketsStore } from "@/modules/sales/application/store/tickets.store";
import type { TicketProduct } from "@/modules/sales/application/models";
import { Checkbox } from "@/modules/shared/components/ui/checkbox";
import { Input } from "@/modules/shared/components/ui/input";
import { formatCurrency } from "@/modules/shared/lib/utils";
import { Button } from "@/modules/shared/components/ui/button";

export const columns: ColumnDef<TicketProduct>[] = [
	{
		id: "select",
		header: () => {
			const seletectedProductIds = useTicketsStore(
				(state) => state.selectedProductIds,
			);
			const productsLenght = useTicketsStore(
				(state) => state.getCurrentTicket()?.products.length || 0,
			);
			const selectAllProducts = useTicketsStore(
				(state) => state.selectAllProducts,
			);

			return (
				<Checkbox
					checked={
						productsLenght > 0 && seletectedProductIds.length === productsLenght
					}
					onCheckedChange={() => selectAllProducts()}
					aria-label="Select all"
				/>
			);
		},
		cell: ({ row }) => {
			const setSelectedProductIds = useTicketsStore(
				(state) => state.setSelectedProductIds,
			);
			const seletectedProductIds = useTicketsStore(
				(state) => state.selectedProductIds,
			);

			const isSelected = seletectedProductIds.includes(row.original.id);

			return (
				<Checkbox
					checked={isSelected}
					onCheckedChange={() => {
						setSelectedProductIds(row.original.id);
					}}
					aria-label="Select row"
				/>
			);
		},
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "barcode",
		header: "Codigo de barras",
		size: 200,
	},
	{
		accessorKey: "description",
		header: "Descripción",
		size: 300,
	},
	{
		accessorKey: "currentPrice",
		header: "Precio venta",
		size: 150,
		cell: ({ row }) => {
			const id = row.original.id;
			const curretStock = row.original.currentStock;
			const currentPrice = row.original.currentPrice;

			const changeProduct = useTicketsStore((state) => state.changeProduct);

			return (
				<div>
					<Input
						value={currentPrice === 0 ? "" : currentPrice}
						step={0.01}
						onChange={(e) => {
							changeProduct(id, {
								newStock: curretStock,
								newCurrentPrice: Number.parseInt(e.target.value) || 0,
							});
						}}
						type="number"
					/>
				</div>
			);
		},
	},
	{
		accessorKey: "currentStock",
		header: "Cant.",
		size: 80,
		cell: ({ row }) => {
			const id = row.original.id;
			const curretStock = row.original.currentStock;
			const currentPrice = row.original.currentPrice;

			const changeProduct = useTicketsStore((state) => state.changeProduct);

			return (
				<div>
					<Input
						value={curretStock === 0 ? "" : curretStock}
						onChange={(e) => {
							changeProduct(id, {
								newStock: Number.parseInt(e.target.value) || 0,
								newCurrentPrice: currentPrice,
							});
						}}
						type="number"
					/>
				</div>
			);
		},
	},
	{
		accessorKey: "stock",
		header: "Existencias",
		size: 50,
		cell: ({ row }) => {
			const currentStock = row.original.currentStock;
			const stock = row.original.stock;

			return <div>{stock - currentStock}</div>;
		},
	},
	{
		accessorKey: "subtotal",
		header: "Subtotal",
		cell: ({ row }) => {
			const currentPrice = row.original.currentPrice;
			const currentStock = row.original.currentStock;

			return <div>{formatCurrency(currentPrice * currentStock)}</div>;
		},
	},
	{
		accessorKey: "actions",
		header: "Acciones",
		size: 100,
		cell: ({ row }) => {
			const id = row.original.id;
			const removeProduct = useTicketsStore((state) => state.removeProduct);
			return (
				<div className="space-x-2">
					<Button
						variant="destructive"
						size="icon"
						onClick={() => removeProduct(id)}
					>
						<Trash2Icon />
					</Button>
				</div>
			);
		},
	},
];
