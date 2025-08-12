import { useTRPC } from "@/integrations/trpc/config";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRefreshClientData } from "./use.refresh-client-data";

export function useMutateClients() {
	const trpc = useTRPC();
	const { refreshClientPageData } = useRefreshClientData();

	const create = useMutation(
		trpc.clients.createClient.mutationOptions({
			onMutate: () => {
				toast.loading("Creando cliente", {
					position: "top-center",
					id: "create-client",
				});
			},
			onSuccess: () => {
				toast.dismiss("create-client");
				toast.success("Cliente creado exitosamente", {
					position: "top-center",
				});
			},
			onError: () => {
				toast.dismiss("create-client");
				toast.error("Error al crear cliente", { position: "top-center" });
			},
		}),
	);

	const update = useMutation(
		trpc.clients.updateClient.mutationOptions({
			onMutate: () => {
				toast.loading("Actualizando cliente", {
					position: "top-center",
					id: "update-client",
				});
			},
			onSuccess: (_, variables) => {
				toast.dismiss("update-client");
				toast.success("Cliente actualizado exitosamente", {
					position: "top-center",
				});
				refreshClientPageData(variables.clientId);
			},
			onError: (err) => {
				toast.dismiss("update-client");
				toast.error(err.message, { position: "top-center" });
			},
		}),
	);

	return {
		create,
		update,
	};
}
