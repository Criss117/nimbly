import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTicketsStore } from "../store/tickets.store";
import { useTRPC } from "@/integrations/trpc/config";

export function useMutateTickets() {
	const trpc = useTRPC();
	const queryClient = useQueryClient();
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
					queryClient.invalidateQueries(
						trpc.clients.findOneBy.queryFilter({
							clientId: variables.clientId,
						}),
					);
					queryClient.invalidateQueries(
						trpc.tickets.findManyByClient.queryFilter({
							clientId: variables.clientId,
						}),
					);
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
