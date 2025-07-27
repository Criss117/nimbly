import { Loader2Icon } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { ClientSummary } from "@nimbly/core/clients";

import { cn } from "@/modules/shared/lib/utils";
import { useTRPC } from "@/integrations/trpc/config";
import { Button } from "@/modules/shared/components/ui/button";
import { SiteHeader } from "@/modules/shared/components/app-sidebar";
import { SearchInput } from "@/modules/shared/components/search-query";
import { ClientsTable } from "@/modules/clients/presentation/components/clients-table";
import { useFilterClients } from "@/modules/clients/application/context/filter-clients.context";
import { CreateClientDialog } from "../components/create-client-dialog";

export function ClientsScreen() {
	const trpc = useTRPC();
	const { limit, searchQuery, setSearchQuery } = useFilterClients();
	const { data, isFetching, hasNextPage, fetchNextPage, refetch } =
		useInfiniteQuery(
			trpc.clients.findMany.infiniteQueryOptions(
				{
					limit,
					searchQuery,
				},
				{
					getNextPageParam: (lastPage) =>
						lastPage.nextCursor?.createdAt
							? {
									createdAt: lastPage.nextCursor.createdAt as unknown as Date,
									lastClientCode: lastPage.nextCursor.lastClientCode,
								}
							: undefined,
				},
			),
		);

	const items = data
		? (data?.pages.flatMap((page) => page.items) as unknown as ClientSummary[])
		: [];

	return (
		<>
			<SiteHeader label="List de Clientes" />
			<ClientsTable.Root
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
							<CreateClientDialog />
							<div className="flex gap-x-2">
								<ClientsTable.Nav />
								<Button variant="outline" size="icon" onClick={() => refetch()}>
									<Loader2Icon
										className={cn("h-4 w-4", isFetching && "animate-spin")}
									/>
								</Button>
							</div>
						</div>
					</header>
					<ClientsTable.TableContainer>
						<ClientsTable.Header />
						<ClientsTable.Body />
					</ClientsTable.TableContainer>
					<ClientsTable.Nav />
				</div>
			</ClientsTable.Root>
		</>
	);
}
