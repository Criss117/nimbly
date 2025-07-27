import { Suspense } from "react";
import {
	useSuspenseInfiniteQuery,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { useTRPC } from "@/integrations/trpc/config";
import type { TicketDetail } from "@nimbly/core/tickets";
import type { InstallmentPlanDetail } from "@nimbly/core/clients";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/modules/shared/components/ui/card";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/modules/shared/components/ui/tabs";
import { TicketsTable } from "./tickets-table";
import { InstallmentsTable } from "./installments-table";

interface Props {
	clientId: string;
}

function InstallmentsListSection({ clientId }: Props) {
	const limit = 10;
	const trpc = useTRPC();
	const { data, isPending, hasNextPage, fetchNextPage } =
		useSuspenseInfiniteQuery(
			trpc.clients.findManyInstallments.infiniteQueryOptions(
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

	const items = data.pages.flatMap(
		(p) => p.items,
	) as unknown as InstallmentPlanDetail[];

	return (
		<InstallmentsTable.Root
			values={{
				items,
				limit,
				isPending,
				hasNextPage,
				fetchNextPage: (callback) => {
					fetchNextPage().then(callback);
				},
			}}
		>
			<InstallmentsTable.TableContainer>
				<InstallmentsTable.Header />
				<InstallmentsTable.Body />
			</InstallmentsTable.TableContainer>
			<InstallmentsTable.Nav />
		</InstallmentsTable.Root>
	);
}
export function TicketsListSection({ clientId }: Props) {
	const trpc = useTRPC();
	const { data } = useSuspenseQuery(
		trpc.tickets.findManyByClient.queryOptions({
			clientId,
		}),
	);

	const items = data as unknown as TicketDetail[];

	return (
		<TicketsTable.Root
			values={{
				items,
				limit: 10,
				isPending: false,
				hasNextPage: false,
				fetchNextPage: () => {},
			}}
		>
			<TicketsTable.TableContainer>
				<TicketsTable.Header />
				<TicketsTable.Body />
			</TicketsTable.TableContainer>
			<TicketsTable.Nav />
		</TicketsTable.Root>
	);
}

export function ClientDataTable({ clientId }: Props) {
	return (
		<Tabs defaultValue="tickets">
			<TabsList className="w-1/3">
				<TabsTrigger value="tickets" className="flex-1">
					Tickets
				</TabsTrigger>
				<TabsTrigger value="installment_plans" className="flex-1">
					Planes de Pago
				</TabsTrigger>
			</TabsList>
			<TabsContent value="tickets">
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<div>
								<CardTitle>Tickets del Cliente</CardTitle>
								<CardDescription>
									Historial completo de tickets y pagos
								</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<Suspense fallback={<div>Loading...</div>}>
							<TicketsListSection clientId={clientId} />
						</Suspense>
					</CardContent>
				</Card>
			</TabsContent>
			<TabsContent value="installment_plans">
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<div>
								<CardTitle>Planes de Pago</CardTitle>
								<CardDescription>
									Historial completo de planes de pago
								</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<Suspense fallback={<div>Loading...</div>}>
							<InstallmentsListSection clientId={clientId} />
						</Suspense>
					</CardContent>
				</Card>
			</TabsContent>
		</Tabs>
	);
}
