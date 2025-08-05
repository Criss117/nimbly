import { createContext, use, useMemo } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	createTicketSchema,
	type CreateTicketSchema,
} from "@/modules/sales/application/models/create-tickets.schema";
import { Form } from "@/modules/shared/components/ui/form";
import { Dialog as DialogView } from "./dialog";
import { useMutateTickets } from "@/modules/sales/application/hooks/use.mutate-tickets";
import type { TicketStore } from "@/modules/sales/application/store/tickets.store";

interface RootProps {
	children: React.ReactNode;
	ticket: TicketStore | undefined;
}

interface Context {
	form: UseFormReturn<CreateTicketSchema, unknown, CreateTicketSchema>;
	ticket: TicketStore | undefined;
	total: number;
}

const CollectTicketContext = createContext<Context | null>(null);

function useCollectTicket() {
	const context = use(CollectTicketContext);
	if (!context) {
		throw new Error(
			"useCollectTicket must be used within a CollectTicketProvider",
		);
	}
	return context;
}

function Root({ children, ticket }: RootProps) {
	const { create } = useMutateTickets();
	const form = useForm<CreateTicketSchema>({
		resolver: zodResolver(createTicketSchema),
		defaultValues: {
			clientId: "",
			payType: "cash",
			items:
				ticket?.products.map((p) => ({
					quantity: p.currentStock,
					description: p.description,
					productId: p.id,
					price: p.currentPrice,
				})) || [],
		},
	});

	const total = useMemo(() => {
		return (
			ticket?.products.reduce(
				(acc, product) => acc + product.salePrice * product.currentStock,
				0,
			) || 0
		);
	}, [ticket]);

	const onSubmit = form.handleSubmit((data: CreateTicketSchema) => {
		const { items, ...rest } = data;

		// const ticketPrint = new Ticket().addProducts(
		// 	items.map((item) => ({
		// 		description: item.description,
		// 		quantity: item.quantity,
		// 		salePrice: item.price,
		// 	})),
		// );

		// fetch(`${thermalInfo.url}/printer/imprimir`, {
		// 	method: "POST",
		// 	headers: {
		// 		"Content-Type": "application/json",
		// 	},
		// 	body: JSON.stringify(ticketPrint.payload),
		// }).then((res) => res.json());

		create.mutate(
			{
				payType: rest.payType,
				clientId: rest.clientId || undefined,
				items: items.map((i) => ({
					description: i.description,
					price: i.price,
					productId: i.productId,
					quantity: i.quantity,
				})),
			},
			{
				onSuccess: () => {
					form.reset();
				},
			},
		);
	});

	return (
		<CollectTicketContext.Provider
			value={{
				form,
				ticket,
				total,
			}}
		>
			<Form {...form}>
				<form onSubmit={onSubmit} id="collect-ticket-form">
					{children}
				</form>
			</Form>
		</CollectTicketContext.Provider>
	);
}

function Dialog() {
	const { ticket, form } = useCollectTicket();

	return <DialogView ticket={ticket} form={form} />;
}

export const CollectTicket = {
	useCollectTicket,
	Root,
	Dialog,
};
