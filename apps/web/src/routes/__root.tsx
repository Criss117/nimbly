import type { useTRPC } from "@/integrations/trpc/config";
import { PageLoader } from "@/modules/shared/components/page-loader";
import type { useQueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { Toaster } from "sonner";

type Context = {
	trpc: ReturnType<typeof useTRPC>;
	queryClient: ReturnType<typeof useQueryClient>;
};

export const Route = createRootRouteWithContext<Context>()({
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
