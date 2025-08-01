import { useTRPC } from "@/integrations/trpc/config";
import { useQueryClient } from "@tanstack/react-query";

export function useRefreshProducts() {
	const trpc = useTRPC();
	const queryClient = useQueryClient();

	const refreshProductsScreen = () => {
		queryClient.invalidateQueries(trpc.products.findMany.infiniteQueryFilter());
	};

	return { refreshProductsScreen };
}
