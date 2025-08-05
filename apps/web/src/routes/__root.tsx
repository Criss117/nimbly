import { Toaster } from "sonner";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { PageLoader } from "@/modules/shared/components/page-loader";
import type { RouterContext } from "@/integrations/router";

export const Route = createRootRouteWithContext<RouterContext>()({
	component: RootComponent,
	pendingComponent: () => <PageLoader />,
});

function RootComponent() {
	return (
		<>
			<Outlet />
			<Toaster />
		</>
	);
}
