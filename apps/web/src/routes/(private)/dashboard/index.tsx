import { SiteHeader } from "@/modules/shared/components/app-sidebar";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(private)/dashboard/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <SiteHeader label="Analiticas" />;
}
