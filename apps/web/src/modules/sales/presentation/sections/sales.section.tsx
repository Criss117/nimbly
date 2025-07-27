import { SearchProducts } from "@/modules/sales/presentation/components/search-products";
import { ProductsList } from "@/modules/sales/presentation/components/products-list";
import { useTicketsStore } from "@/modules/sales/application/store/tickets.store";
import { CreateCommonArt } from "@/modules/sales/presentation/components/create-common-art";
import { Button } from "@/modules/shared/components/ui/button";

export function SalesSection() {
	const selectedProductIds = useTicketsStore(
		(state) => state.selectedProductIds,
	);
	const toWholesale = useTicketsStore((state) => state.toWholesale);

	const hasIds = selectedProductIds.length > 0;

	return (
		<>
			<SearchProducts />
			<div className="my-5 space-x-2 w-2/5 flex">
				<CreateCommonArt />
				<ProductsList />
				<Button
					className="w-1/3"
					variant="outline"
					disabled={!hasIds}
					onClick={toWholesale}
				>
					Mayoreo
				</Button>
			</div>
		</>
	);
}
