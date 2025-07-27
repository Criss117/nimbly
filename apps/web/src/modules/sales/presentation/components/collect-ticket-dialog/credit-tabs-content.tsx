import { CheckCircle } from "lucide-react";
import { Suspense, useState } from "react";
import {
	Command,
	CommandEmpty,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/modules/shared/components/ui/command";
import type { ControllerRenderProps } from "react-hook-form";
import { useSaveTicketForm } from "@/modules/sales/application/store/save-ticket-form.store";
import type { CreateTicketSchema } from "@/modules/sales/application/models/create-tickets.schema";
import {
	FormField,
	FormItem,
	FormMessage,
} from "@/modules/shared/components/ui/form";
import type { ClientSummary } from "@nimbly/core/clients";
import { useTRPC } from "@/integrations/trpc/config";
import { useInfiniteQuery } from "@tanstack/react-query";
import { InfiniteScroll } from "@/modules/shared/components/infinite-scroll";

export function CreditTabsContent() {
	const [searchQuery, setSearchQuery] = useState("");
	const { form } = useSaveTicketForm();

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
							<UsersList query={searchQuery} field={field} />
						</Suspense>
					</Command>
				</FormItem>
			)}
		/>
	);
}

function UsersList({
	query,
	field,
}: {
	query: string;
	field: ControllerRenderProps<CreateTicketSchema, "clientId">;
}) {
	const { form } = useSaveTicketForm();
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
