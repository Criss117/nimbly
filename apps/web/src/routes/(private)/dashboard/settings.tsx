import { SettingsScreen } from "@/modules/settings/presentation/screen/settings.screen";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(private)/dashboard/settings")({
	component: RouteComponent,
});

function RouteComponent() {
	return <SettingsScreen />;
}
