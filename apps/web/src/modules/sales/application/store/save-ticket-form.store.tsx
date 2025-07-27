import { useForm } from "react-hook-form";
import {
	createTicketSchema,
	type CreateTicketSchema,
} from "../models/create-tickets.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createContext, useContext, useEffect, useState } from "react";
import { useMutateTickets } from "../hooks/use.mutate-tickets";

interface Context {
	form: ReturnType<typeof useForm<CreateTicketSchema>>;
	formValues: CreateTicketSchema | undefined;
	onSubmit: (
		data: CreateTicketSchema,
		actions: {
			onSuccess: () => void;
		},
	) => Promise<void>;
}

export const SaveTicketFormStoreContext = createContext<Context | null>(null);

export function useSaveTicketForm() {
	const context = useContext(SaveTicketFormStoreContext);

	if (!context) {
		throw new Error(
			"useSaveTicketForm must be used within a SaveTicketFormStoreProvider",
		);
	}

	return context;
}

export function SaveTicketFormStoreProvider({
	children,
}: { children: React.ReactNode }) {
	const { create } = useMutateTickets();
	const [formValues, setFormValues] = useState<CreateTicketSchema>();
	const form = useForm<CreateTicketSchema>({
		resolver: zodResolver(createTicketSchema),
		defaultValues: {
			clientId: "",
			payType: "cash",
			items: [],
		},
	});

	const onSubmit = async (
		data: CreateTicketSchema,
		actions: { onSuccess: () => void },
	) => {
		const { items, ...rest } = data;

		create.mutate(
			{
				payType: rest.payType,
				clientId: rest.clientId,
				items: items.map((i) => ({
					description: i.description,
					price: i.price,
					productId: i.productId,
					quantity: i.quantity,
				})),
			},
			{
				onSuccess: () => {
					actions.onSuccess();
				},
			},
		);
	};

	useEffect(() => {
		const callback = form.subscribe({
			formState: {
				values: true,
			},
			callback: (data) => {
				setFormValues(data.values);
			},
		});

		return () => callback();
	}, [form.subscribe]);

	return (
		<SaveTicketFormStoreContext.Provider value={{ form, onSubmit, formValues }}>
			{children}
		</SaveTicketFormStoreContext.Provider>
	);
}
