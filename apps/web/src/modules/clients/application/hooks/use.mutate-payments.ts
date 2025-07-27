import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useRefreshClientData } from "./use.refresh-client-data";
import { useTRPC } from "@/integrations/trpc/config";

export function useMutatePayments() {
	const trpc = useTRPC();
	const { refreshClientPageData } = useRefreshClientData();

	const create = useMutation(
		trpc.clients.payDebt.mutationOptions({
			onMutate: () => {
				toast.loading("Creando pago...", {
					id: "pay-debt-mutation",
				});
			},
			onSuccess: (_, variables) => {
				toast.dismiss("pay-debt-mutation");
				toast.success("Pago creado exitosamente", {
					id: "pay-debt-mutation",
				});
				refreshClientPageData(variables.clientId);
			},
			onError: () => {
				toast.dismiss("pay-debt-mutation");
				toast.error("Error al crear el pago");
			},
		}),
	);

	const deletePayments = useMutation(
		trpc.clients.deleteManyPayments.mutationOptions({
			onMutate: ({ ids }) => {
				toast.loading(`Eliminando ${ids.length} pagos`, {
					id: "delete-payments",
				});
			},
			onSuccess: (_, variables) => {
				toast.dismiss("delete-payments");
				toast.success("Pagos eliminados");
				refreshClientPageData(variables.clientId);
			},
			onError: (err) => {
				toast.dismiss("delete-payments");
				toast.error(err.message);
			},
		}),
	);

	return {
		create,
		deletePayments,
	};
}
