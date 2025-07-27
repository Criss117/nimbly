import { createFileRoute } from "@tanstack/react-router";
import { PageLoader } from "@/modules/shared/components/page-loader";
import { SalesScreen } from "@/modules/sales/presentation/screens/sales.screen";

export const Route = createFileRoute("/(private)/sales")({
	component: RouteComponent,
	pendingComponent: () => <PageLoader />,
});

function RouteComponent() {
	return <SalesScreen />;
}
