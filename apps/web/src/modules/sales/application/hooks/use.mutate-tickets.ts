import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useTicketsStore } from "../store/tickets.store";
import { useTRPC } from "@/integrations/trpc/config";
import { useRefreshClientData } from "@/modules/clients/application/hooks/use.refresh-client-data";

export function useMutateTickets() {
	const trpc = useTRPC();
	const { refreshClientPageData } = useRefreshClientData();
	const clearCurrentTicket = useTicketsStore((s) => s.clearCurrentTicket);

	const create = useMutation(
		trpc.tickets.create.mutationOptions({
			onMutate: () => {
				toast.loading("Creando ticket", {
					position: "top-center",
					id: "create-ticket",
				});
			},
			onSuccess: (_, variables) => {
				if (variables.clientId) {
					refreshClientPageData(variables.clientId);
				}
				toast.dismiss("create-ticket");
				toast.success("Ticket creado exitosamente", {
					position: "top-center",
				});
				clearCurrentTicket();
			},
			onError: () => {
				toast.dismiss("create-ticket");
				toast.error("Error al crear ticket", { position: "top-center" });
			},
		}),
	);

	return {
		create,
	};
}
