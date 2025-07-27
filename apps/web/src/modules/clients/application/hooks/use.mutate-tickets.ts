import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRefreshClientData } from "./use.refresh-client-data";
import { useTRPC } from "@/integrations/trpc/config";

export function useMutateTickets() {
	const trpc = useTRPC();
	const { refreshClientPageData } = useRefreshClientData();

	const deleteTicket = useMutation(
		trpc.tickets.delete.mutationOptions({
			onMutate: () => {
				toast.loading("Eliminando ticket", {
					id: "delete-ticket",
				});
			},
			onSuccess: (_, variables) => {
				toast.dismiss("delete-ticket");
				toast.success("Ticket eliminado");
				refreshClientPageData(variables.clientId);
			},
			onError: (err) => {
				toast.dismiss("delete-ticket");
				toast.error(err.message);
			},
		}),
	);

	return {
		deleteTicket,
	};
}
