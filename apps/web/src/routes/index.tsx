import { useTRPC } from "@/integrations/trpc/config";
import { InfiniteScroll } from "@/modules/shared/components/infinite-scroll";
import {
	useSuspenseInfiniteQuery,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: RouteComponent,
});

function RouteComponent() {
	const trpc = useTRPC();
	const products = useSuspenseInfiniteQuery(
		trpc.products.findMany.infiniteQueryOptions(
			{
				limit: 1,
			},
			{
				getNextPageParam: (lastPage) =>
					lastPage.nextCursor
						? {
								createdAt: lastPage.nextCursor.createdAt as unknown as Date,
								lastId: lastPage.nextCursor.lastId,
							}
						: undefined,
			},
		),
	);
	// const clients = useSuspenseQuery(trpc.clients.findAll.queryOptions());

	// console.log(products.data);

	return (
		<div>
			<pre>
				<code>{JSON.stringify(products.data, null, 2)}</code>
			</pre>
			<InfiniteScroll
				fetchNextPage={products.fetchNextPage}
				hasNextPage={products.hasNextPage}
			/>
		</div>
	);
}
