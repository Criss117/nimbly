import { useTRPC } from "@/integrations/trpc/config";
import type { CategoryDetail } from "@nimbly/core/products";
import { useSuspenseQuery } from "@tanstack/react-query";

export function useFindAllCategories() {
	const trpc = useTRPC();
	const query = useSuspenseQuery(trpc.categories.findAll.queryOptions());

	return {
		...query,
		data: query.data as unknown as CategoryDetail[],
	};
}
