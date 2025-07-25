import { useTRPC } from "@/integrations/trpc/config";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRefreshProducts } from "./use.refresh-products";

export function useMutateProducts() {
	const trpc = useTRPC();
	const { refreshProductsScreen } = useRefreshProducts();

	const create = useMutation(
		trpc.products.create.mutationOptions({
			onSuccess: () => {
				refreshProductsScreen();
				toast.success("Producto creado");
			},
			onError: (error) => {
				toast.error(error.message);
			},
		}),
	);

	const update = useMutation(
		trpc.products.update.mutationOptions({
			onMutate: () => {
				toast.loading("Actualizando producto", {
					id: "update_product",
				});
			},
			onSuccess: () => {
				refreshProductsScreen();
				toast.dismiss("update_product");
				toast.success("Producto actualizado");
			},
			onError: (error) => {
				toast.dismiss("update_product");
				toast.error(error.message);
			},
		}),
	);

	const deleteProduct = useMutation(
		trpc.products.delete.mutationOptions({
			onMutate: () => {
				toast.loading("Eliminando producto", {
					id: "delete_product",
				});
			},
			onSuccess: () => {
				refreshProductsScreen();
				toast.dismiss("delete_product");
				toast.success("Producto eliminado");
			},
			onError: (error) => {
				toast.dismiss("delete_product");
				toast.error(error.message);
			},
		}),
	);

	return {
		create,
		update,
		deleteProduct,
	};
}
