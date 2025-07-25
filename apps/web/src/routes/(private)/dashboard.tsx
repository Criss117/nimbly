import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
	SidebarInset,
	SidebarProvider,
} from "@/modules/shared/components/ui/sidebar";
import { AppSidebar } from "@/modules/shared/components/app-sidebar";

export const Route = createFileRoute("/(private)/dashboard")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<SidebarProvider>
			<AppSidebar variant="inset" />
			<SidebarInset>
				<Outlet />
			</SidebarInset>
		</SidebarProvider>
	);
}
