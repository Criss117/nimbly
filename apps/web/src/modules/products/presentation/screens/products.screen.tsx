import { Loader2Icon } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useTRPC } from "@/integrations/trpc/config";
import type { ProductDetail } from "@nimbly/core/products";
import { ProductsTable } from "@/modules/products/presentation/components/products-table";
import { SiteHeader } from "@/modules/shared/components/app-sidebar";
import { useFilterProducts } from "@/modules/products/application/context/filter-products.context";
import { SearchInput } from "@/modules/shared/components/search-query";
import { Button } from "@/modules/shared/components/ui/button";
import { cn } from "@/modules/shared/lib/utils";
import { CreateProductDialog } from "../components/create-product-dialog";

export function ProductsScreen() {
	const { limit, searchQuery, setSearchQuery } = useFilterProducts();
	const trpc = useTRPC();
	const { data, isFetching, hasNextPage, fetchNextPage, refetch } =
		useInfiniteQuery(
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

	const items = data
		? (data?.pages.flatMap((page) => page.items) as unknown as ProductDetail[])
		: [];

	return (
		<>
			<SiteHeader label="Productos" />
			<ProductsTable.Root
				values={{
					items,
					limit,
					isPending: isFetching,
					hasNextPage,
					fetchNextPage: (callback) => fetchNextPage().then(callback),
				}}
			>
				<div className="m-10 space-y-10">
					<header className="flex justify-between gap-x-5">
						<div className="w-1/2">
							<SearchInput
								placeholder="Buscar productos"
								query={searchQuery}
								setQuery={(value) => setSearchQuery(value)}
							/>
						</div>
						<div className="flex items-end flex-col gap-y-2">
							<CreateProductDialog />
							<div className="flex gap-x-2">
								<ProductsTable.Nav />
								<Button variant="outline" size="icon" onClick={() => refetch()}>
									<Loader2Icon
										className={cn("h-4 w-4", isFetching && "animate-spin")}
									/>
								</Button>
							</div>
						</div>
					</header>
					<ProductsTable.TableContainer>
						<ProductsTable.Header />
						<ProductsTable.Body />
					</ProductsTable.TableContainer>
					<ProductsTable.Nav />
				</div>
			</ProductsTable.Root>
		</>
	);
}
