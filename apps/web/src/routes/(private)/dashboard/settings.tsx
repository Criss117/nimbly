import { SettingsPage } from "@/modules/settings/presentation/screent/settings.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(private)/dashboard/settings")({
	component: RouteComponent,
});

function RouteComponent() {
	return <SettingsPage />;
}
