import { createContext, use, useState } from "react";
import { PencilIcon } from "lucide-react";
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
import type { CategoryDetail, ProductDetail } from "@nimbly/core/products";

type Product = Omit<ProductDetail, "barcode"> & {
	barcode: string;
};

interface Context {
	product: Product | null;
	isOpen: boolean;
	setProduct: (product: Product) => void;
	open: () => void;
	close: () => void;
}

interface TriggerProps {
	product: Omit<ProductDetail, "barcode"> & {
		barcode: string;
	};
}

interface RootProps {
	children: React.ReactNode;
	categories: CategoryDetail[];
}

const EditProductFormContext = createContext<Context | null>(null);

function useEditProductForm() {
	const context = use(EditProductFormContext);

	if (!context) {
		throw new Error(
			"useEditProductForm must be used within a EditProductFormContext.Provider",
		);
	}

	return context;
}

function Root({ children, categories }: RootProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [product, setProduct] = useState<Product | null>(null);

	const open = () => setIsOpen(true);
	const close = () => setIsOpen(false);

	return (
		<EditProductFormContext.Provider
			value={{
				isOpen,
				product,
				open,
				close,
				setProduct,
			}}
		>
			<Dialog
				open={isOpen}
				onOpenChange={(value) => {
					setIsOpen(value);
					if (!value) {
						setProduct(null);
					}
				}}
			>
				{product && (
					<ProductForm.Root
						action="update"
						product={product}
						categories={categories}
						onSuccess={() => {
							close();
							setProduct(null);
						}}
					>
						<DialogTrigger asChild className="hidden">
							open
						</DialogTrigger>
						<Content />
					</ProductForm.Root>
				)}
			</Dialog>
			{children}
		</EditProductFormContext.Provider>
	);
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
			<ProductForm.SelectCategory />
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

function Trigger({ product }: TriggerProps) {
	const { open, setProduct } = useEditProductForm();

	const handleClick = () => {
		setProduct(product);
		open();
	};

	return (
		<Button size="icon" variant="outline" onClick={handleClick}>
			<PencilIcon />
		</Button>
	);
}

export const EditProductDialog = {
	Root,
	useEditProductForm,
	Trigger,
};
