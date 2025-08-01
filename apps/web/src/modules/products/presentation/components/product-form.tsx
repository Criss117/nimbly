import { createContext, use, useMemo, useState } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import {
	createProductDto,
	type CategoryDetail,
	type CreateProductDto,
	type ProductSummary,
} from "@nimbly/core/products";
import { useMutateProducts } from "@/modules/products/application/hooks/use.mutate-products";
import { Form } from "@/modules/shared/components/ui/form";
import { FormInput } from "@/modules/shared/components/form/form-input";
import { Button } from "@/modules/shared/components/ui/button";
import { ComboBoxInput } from "@/modules/shared/components/form/combobox-input";

interface RootProps {
	children: React.ReactNode;
	product?: Omit<ProductSummary, "barcode"> & { barcode: string };
	action: "create" | "update";
	categories: CategoryDetail[];
}

interface Context {
	form: UseFormReturn<CreateProductDto, unknown, CreateProductDto>;
	action: "create" | "update";
	isPending: boolean;
	categories: CategoryDetail[];
	product?: Omit<ProductSummary, "barcode"> & { barcode: string };
	onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
	clearForm: () => void;
}

const ProductFormContext = createContext<Context | null>(null);

function useProductForm() {
	const context = use(ProductFormContext);

	if (!context) {
		throw new Error(
			"useProductForm must be used within a ProductFormContext.Provider",
		);
	}

	return context;
}

const defaultValues: CreateProductDto = {
	barcode: "",
	description: "",
	costPrice: 0,
	salePrice: 0,
	wholesalePrice: 0,
	stock: 0,
	minStock: 0,
};

function Root({ action, children, product, categories }: RootProps) {
	if (action === "update" && !product) {
		throw new Error("ProductForm.Root must have a product");
	}

	const { create, update } = useMutateProducts();
	const form = useForm<CreateProductDto>({
		resolver: zodResolver(createProductDto),
		defaultValues: product
			? {
					barcode: product.barcode,
					description: product.description,
					costPrice: product.costPrice,
					salePrice: product.salePrice,
					wholesalePrice: product.wholesalePrice,
					stock: product.stock,
					minStock: product.minStock,
					categoryId: product.categoryId,
				}
			: defaultValues,
	});

	const onSubmit = form.handleSubmit(async (data) => {
		if (action === "create") {
			create.mutate(
				{
					...data,
					categoryId: data.categoryId ? data.categoryId : undefined,
				},
				{
					onSuccess: () => {
						form.reset();
					},
				},
			);
		}

		if (action === "update" && product) {
			update.mutate(
				{
					productId: product.id,
					data: {
						...data,
						categoryId: data.categoryId ? data.categoryId : undefined,
					},
				},
				{
					onSuccess: () => {
						form.reset();
					},
				},
			);
		}
	});

	const clearForm = () => {
		form.reset();
	};

	return (
		<ProductFormContext.Provider
			value={{
				form,
				action,
				isPending: create.isPending || update.isPending,
				product,
				categories,
				onSubmit,
				clearForm,
			}}
		>
			<Form {...form}>
				<form
					onSubmit={onSubmit}
					className="space-y-5"
					id={product ? `update-product-${product.id}` : "create-product"}
				>
					{children}
				</form>
			</Form>
		</ProductFormContext.Provider>
	);
}

function Submit() {
	const { action, isPending, product } = useProductForm();

	return (
		<Button
			className="w-full flex-1 flex-row gap-x-2"
			type="submit"
			form={product ? `update-product-${product.id}` : "create-product"}
			disabled={isPending}
		>
			{isPending && (
				<Loader2Icon size="small" color="black" className="animate-spin" />
			)}
			<span>{action === "update" ? "Editar" : "Agregar"}</span>
		</Button>
	);
}

function Barcode() {
	const { form } = useProductForm();
	return (
		<FormInput
			label="Código de barras"
			name="barcode"
			control={form.control}
			placeholder="Código de barras"
			required
		/>
	);
}

function Description() {
	const { form } = useProductForm();
	return (
		<FormInput
			label="Descripción"
			name="description"
			control={form.control}
			placeholder="Descripción del producto"
			required
		/>
	);
}

function CostPrice() {
	const { form } = useProductForm();

	return (
		<FormInput
			label="Precio de compra"
			name="costPrice"
			control={form.control}
			itemClassName="flex-1"
			type="number"
			placeholder="Precio de compra"
			required
		/>
	);
}

function SalePrice() {
	const { form } = useProductForm();

	return (
		<FormInput
			label="Precio de venta"
			name="salePrice"
			control={form.control}
			itemClassName="flex-1"
			type="number"
			required
			placeholder="Precio de venta"
		/>
	);
}

function WholesalePrice() {
	const { form } = useProductForm();

	return (
		<FormInput
			label="Precio de mayoreo"
			name="wholesalePrice"
			control={form.control}
			type="number"
			placeholder="Precio al por mayor"
			required
		/>
	);
}

function Stock() {
	const { form } = useProductForm();

	return (
		<FormInput
			className="flex-1"
			label="Stock"
			name="stock"
			control={form.control}
			required
			itemClassName="flex-1"
			placeholder="Stock"
			type="number"
		/>
	);
}

function MinStock() {
	const { form } = useProductForm();

	return (
		<FormInput
			className="flex-1"
			label="Stock mínimo"
			name="minStock"
			control={form.control}
			type="number"
			required
			placeholder="Stock mínimo"
			itemClassName="flex-1"
		/>
	);
}

function SelectCategory() {
	const { form, categories } = useProductForm();

	const items = useMemo(
		() =>
			categories.map((category) => ({
				value: category.id.toString(),
				label: category.name,
			})),
		[categories],
	);

	return (
		<ComboBoxInput
			name="categoryId"
			label="Categoría"
			searchPlaceholder="Buscar categoría"
			control={form.control}
			items={items}
		/>
	);
}

export const ProductForm = {
	Root,
	useProductForm,
	WholesalePrice,
	Stock,
	MinStock,
	Submit,
	Description,
	CostPrice,
	SalePrice,
	Barcode,
	SelectCategory,
};
