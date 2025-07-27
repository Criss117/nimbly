import { useTRPC } from "@/integrations/trpc/config";
import { ClientScreen } from "@/modules/clients/presentation/screens/client.screen";
import type { ClientDetail } from "@nimbly/core/clients";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { TRPCClientError } from "@trpc/client";
import type { TRPCError } from "@trpc/server";

export const Route = createFileRoute("/(private)/dashboard/clients/$clientid")({
	component: RouteComponent,
	beforeLoad: async ({ context, params }) => {
		await context.queryClient
			.ensureQueryData(
				context.trpc.clients.findOneBy.queryOptions({
					clientId: params.clientid,
				}),
			)
			.catch((err) => {
				if (!(err instanceof TRPCClientError)) {
					throw redirect({
						to: "/dashboard",
					});
				}

				const data = err.data as TRPCError;

				if (data.code === "NOT_FOUND") {
					throw redirect({
						to: "/dashboard/clients",
					});
				}

				throw redirect({
					to: "/dashboard",
				});
			});
	},

	pendingComponent: () => <div>Loading...</div>,
});

function RouteComponent() {
	const { clientid } = Route.useParams();
	const trpc = useTRPC();
	const { data } = useSuspenseQuery(
		trpc.clients.findOneBy.queryOptions({
			clientId: clientid,
		}),
	);

	return <ClientScreen client={data as unknown as ClientDetail} />;
}
