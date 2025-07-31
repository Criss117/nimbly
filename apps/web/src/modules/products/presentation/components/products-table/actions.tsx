import type { ProductDetail } from "@nimbly/core/products";
import { EditProductDialog } from "../edit-product-dialog";
import { DeleteProduct } from "../delete-product";

interface Props {
	product: ProductDetail;
}

export function ProductActions({ product }: Props) {
	return (
		<div className="space-x-2 w-full flex">
			<EditProductDialog.Trigger
				product={{ ...product, barcode: product.barcode || "" }}
			/>
			<DeleteProduct productId={product.id} description={product.description} />
		</div>
	);
}
