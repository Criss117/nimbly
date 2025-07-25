import { FilterProductsProvider } from "@/modules/products/application/context/filter-products.context";
import { ProductsScreen } from "@/modules/products/presentation/screens/products.screen";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/(private)/dashboard/products")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<FilterProductsProvider>
			<Suspense fallback={<div>Loading...</div>}>
				<ProductsScreen />
			</Suspense>
		</FilterProductsProvider>
	);
}
