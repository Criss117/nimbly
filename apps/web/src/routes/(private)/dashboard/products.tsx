import { Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FilterProductsProvider } from "@/modules/products/application/context/filter-products.context";
import { ProductsScreen } from "@/modules/products/presentation/screens/products.screen";
import { PageLoader } from "@/modules/shared/components/page-loader";

export const Route = createFileRoute("/(private)/dashboard/products")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		await context.queryClient.ensureQueryData(
			context.trpc.categories.findAll.queryOptions(),
		);
	},
	pendingComponent: () => <PageLoader />,
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
