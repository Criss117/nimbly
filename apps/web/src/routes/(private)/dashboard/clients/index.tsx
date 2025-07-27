import { FilterClientsProvider } from "@/modules/clients/application/context/filter-clients.context";
import { ClientsScreen } from "@/modules/clients/presentation/screens/clients.screen";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(private)/dashboard/clients/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<FilterClientsProvider>
			<ClientsScreen />
		</FilterClientsProvider>
	);
}
