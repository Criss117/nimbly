import { Suspense, useState } from "react";
import { CheckCircle } from "lucide-react";
import { useTRPC } from "@/integrations/trpc/config";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import type { ClientSummary } from "@nimbly/core/clients";

import {
	Command,
	CommandEmpty,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/modules/shared/components/ui/command";
import {
	FormField,
	FormItem,
	FormMessage,
} from "@/modules/shared/components/ui/form";
import { InfiniteScroll } from "@/modules/shared/components/infinite-scroll";
import type { CreateTicketSchema } from "@/modules/sales/application/models/create-tickets.schema";

interface Props {
	form: UseFormReturn<CreateTicketSchema, unknown, CreateTicketSchema>;
}

interface ListProps {
	query: string;
	field: ControllerRenderProps<CreateTicketSchema, "clientId">;
	form: UseFormReturn<CreateTicketSchema, unknown, CreateTicketSchema>;
}

export function UsersList({ form }: Props) {
	const [searchQuery, setSearchQuery] = useState("");

	return (
		<FormField
			control={form.control}
			name="clientId"
			render={({ field }) => (
				<FormItem>
					<FormMessage />
					<Command>
						<CommandInput
							placeholder="Buscar cliente"
							onValueChange={setSearchQuery}
						/>
						<Suspense fallback={<CommandEmpty>Loading...</CommandEmpty>}>
							<List query={searchQuery} field={field} form={form} />
						</Suspense>
					</Command>
				</FormItem>
			)}
		/>
	);
}

function List({ query, field, form }: ListProps) {
	const trpc = useTRPC();
	const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
		useInfiniteQuery(
			trpc.clients.findMany.infiniteQueryOptions(
				{
					limit: 20,
					searchQuery: query,
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

	const handleSelect = (client: ClientSummary) => {
		form.setValue("clientId", client.id);
		form.setValue("clientName", client.fullName);
	};

	return (
		<>
			<CommandList>
				<CommandEmpty>No se encotro el cliente</CommandEmpty>
				{items.map((c) => (
					<CommandItem
						key={c.id}
						className="flex items-center justify-between"
						onSelect={() => handleSelect(c)}
					>
						{c.fullName}
						{field.value === c.id && <CheckCircle />}
					</CommandItem>
				))}
				<InfiniteScroll
					hasNextPage={hasNextPage}
					isFetchingNextPage={isFetchingNextPage}
					fetchNextPage={fetchNextPage}
				/>
			</CommandList>
		</>
	);
}
