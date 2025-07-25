import { Trash2Icon } from "lucide-react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/modules/shared/components/ui/alert-dialog";
import { Button } from "@/modules/shared/components/ui/button";
import { useMutateProducts } from "@/modules/products/application/hooks/use.mutate-products";

interface Props {
	productId: number;
	description: string;
}

export function DeleteProduct({ productId, description }: Props) {
	const { deleteProduct } = useMutateProducts();

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="destructive" size="icon">
					<Trash2Icon />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Está seguro de eliminar{" "}
						<span className="font-bold text-xl italic">{description}</span>?
					</AlertDialogTitle>
					<AlertDialogDescription>
						Esta accion se puede deshacer. El producto no se eliminará de forma
						permanente y podrá recuperarse en cualquier momento.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={deleteProduct.isPending}>
						Cancelar
					</AlertDialogCancel>
					<AlertDialogAction
						disabled={deleteProduct.isPending}
						onClick={() =>
							deleteProduct.mutate({
								productId,
							})
						}
					>
						Continuar
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
