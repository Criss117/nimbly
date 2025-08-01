import { useState } from "react";
import { PencilIcon, PlusCircleIcon } from "lucide-react";
import { Button } from "@/modules/shared/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/modules/shared/components/ui/dialog";
import { ProductForm } from "./product-form";
import type { ProductDetail } from "@nimbly/core/products";

interface Props {
	product: ProductDetail;
}

function Content() {
	const { clearForm } = ProductForm.useProductForm();

	return (
		<DialogContent className="min-w-3xl">
			<DialogHeader>
				<DialogTitle>Agregar nuevo producto</DialogTitle>
				<DialogDescription>
					Aquí podrás agregar un nuevo producto
				</DialogDescription>
			</DialogHeader>
			<fieldset className="flex justify-between gap-x-2">
				<ProductForm.Barcode />
				<ProductForm.Description />
			</fieldset>
			<fieldset className="flex justify-between gap-x-2">
				<ProductForm.CostPrice />
				<ProductForm.SalePrice />
				<ProductForm.WholesalePrice />
			</fieldset>
			<fieldset className="flex justify-between gap-x-2 items-center">
				<ProductForm.Stock />
				<ProductForm.MinStock />
			</fieldset>
			<DialogFooter className="sm:justify-start">
				<DialogClose asChild>
					<Button
						type="button"
						variant="secondary"
						className="flex-1"
						onClick={clearForm}
					>
						Cancelar
					</Button>
				</DialogClose>
				<ProductForm.Submit />
			</DialogFooter>
		</DialogContent>
	);
}

export function EditProductDialog({ product }: Props) {
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<ProductForm.Root action="update" product={product}>
				<DialogTrigger asChild>
					<Button size="icon" variant="outline">
						<PencilIcon />
					</Button>
				</DialogTrigger>
				<Content />
			</ProductForm.Root>
		</Dialog>
	);
}
