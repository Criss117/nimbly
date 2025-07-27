import { useTRPC } from "@/integrations/trpc/config";
import { useQueryClient } from "@tanstack/react-query";

export type SelectClientData =
	| "tickets"
	| "installments"
	| "payments"
	| "client";

export function useRefreshClientData() {
	const trpc = useTRPC();
	const queryClient = useQueryClient();

	const refreshClientPageData = (
		clientId: string,
		select?: SelectClientData[],
	) => {
		const refetchQueries = select ?? [
			"tickets",
			"installments",
			"payments",
			"client",
		];

		if (refetchQueries.includes("client")) {
			queryClient.invalidateQueries(
				trpc.clients.findOneBy.queryOptions({
					clientId,
				}),
			);
		}

		if (refetchQueries.includes("tickets")) {
			queryClient.invalidateQueries(
				trpc.tickets.findManyByClient.queryOptions({
					clientId,
				}),
			);
		}

		if (refetchQueries.includes("installments")) {
			queryClient.invalidateQueries(
				trpc.clients.findManyInstallments.infiniteQueryFilter({
					clientId,
				}),
			);
		}

		if (refetchQueries.includes("payments")) {
			queryClient.invalidateQueries(
				trpc.clients.findManyPayments.infiniteQueryFilter({
					clientId,
				}),
			);
		}
	};

	return {
		refreshClientPageData,
	};
}
