import { Suspense, useMemo } from "react";
import { HandCoins } from "lucide-react";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useTRPC } from "@/integrations/trpc/config";
import type { PaymentSummary } from "@nimbly/core/clients";

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/modules/shared/components/ui/dialog";
import { Button } from "@/modules/shared/components/ui/button";
import { PaysListTable } from "./pays-list-table/index";
import { useMutatePayments } from "@/modules/clients/application/hooks/use.mutate-payments";
import { ScrollArea } from "@/modules/shared/components/ui/scroll-area";
import { InfiniteScroll } from "@/modules/shared/components/infinite-scroll";

interface Props {
	clientId: string;
}

function Footer({ clientId }: Props) {
	const { table } = PaysListTable.usePaysListTable();
	const { deletePayments } = useMutatePayments();

	const selectedRows = table.getFilteredSelectedRowModel().rows;
	const selectedItemIds = selectedRows.map((row) => row.original.id);

	const onDelete = () => {
		if (selectedRows.length === 0) {
			return;
		}

		deletePayments.mutate(
			{
				clientId,
				ids: selectedItemIds,
			},
			{
				onSuccess: () => {
					table.setRowSelection({});
				},
			},
		);
	};

	return (
		<DialogFooter>
			<DialogClose asChild>
				<Button variant="outline" className="flex-1" type="submit">
					Cerrar
				</Button>
			</DialogClose>
			<Button
				className="flex-1"
				variant="destructive"
				disabled={selectedRows.length === 0}
				onClick={onDelete}
			>
				Eliminar {table.getFilteredSelectedRowModel().rows.length} pago(s)
			</Button>
		</DialogFooter>
	);
}

function Content({ clientId }: Props) {
	const trpc = useTRPC();
	const limit = 10;
	const { data, isPending, hasNextPage, fetchNextPage, isFetchingNextPage } =
		useSuspenseInfiniteQuery(
			trpc.clients.findManyPayments.infiniteQueryOptions(
				{
					clientId,
					limit,
				},
				{
					getNextPageParam: (lastPage) =>
						lastPage.nextCursor?.createdAt
							? {
									createdAt: lastPage.nextCursor.createdAt as unknown as Date,
									lastId: lastPage.nextCursor.lastId,
								}
							: undefined,
				},
			),
		);

	const items = useMemo(
		() =>
			data.pages.flatMap((page) => page.items) as unknown as PaymentSummary[],
		[data.pages],
	);

	return (
		<PaysListTable.Root
			values={{
				items,
				isPending,
				limit,
			}}
		>
			<ScrollArea className="h-96">
				<PaysListTable.TableContainer>
					<PaysListTable.Header />
					<PaysListTable.Body />
				</PaysListTable.TableContainer>
				<InfiniteScroll
					hasNextPage={hasNextPage}
					fetchNextPage={fetchNextPage}
					isFetchingNextPage={isFetchingNextPage}
				/>
			</ScrollArea>
			<Footer clientId={clientId} />
		</PaysListTable.Root>
	);
}

export function PaysList({ clientId }: Props) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="flex-1">
					<HandCoins />
					Lista de pagos
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Lista de pagos</DialogTitle>
					<DialogDescription />
				</DialogHeader>
				<Suspense fallback={<div>Loading...</div>}>
					<Content clientId={clientId} />
				</Suspense>
			</DialogContent>
		</Dialog>
	);
}
