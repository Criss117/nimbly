import { useInfiniteQuery } from "@tanstack/react-query";
import { useFilterProducts } from "../context/filter-products.context";
import { useTRPC } from "@/integrations/trpc/config";
import type { ProductDetail } from "@nimbly/core/products";

export function useFindManyProducts() {
	const trpc = useTRPC();
	const { limit, searchQuery, setSearchQuery, setLimit } = useFilterProducts();
	const query = useInfiniteQuery(
		trpc.products.findMany.infiniteQueryOptions(
			{
				limit,
				searchQuery,
			},
			{
				getNextPageParam: (lastPage) =>
					lastPage.nextCursor
						? {
								lastId: lastPage.nextCursor.lastId,
								createdAt: lastPage.nextCursor.createdAt as unknown as Date,
							}
						: undefined,
			},
		),
	);

	return {
		...query,
		data: query.data
			? (query.data?.pages.flatMap(
					(page) => page.items,
				) as unknown as ProductDetail[])
			: [],
		limit,
		searchQuery,
		setSearchQuery,
		setLimit,
	};
}
