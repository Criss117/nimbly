import { createContext, use } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { Loader2Icon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	createClientDto,
	type ClientDetail,
	type CreateClientDto,
} from "@nimbly/core/clients";
import { Form } from "@/modules/shared/components/ui/form";
import { useMutateClients } from "@/modules/clients/application/hooks/use.mutate-client";
import { Button } from "@/modules/shared/components/ui/button";
import { FormInput } from "@/modules/shared/components/form/form-input";
import { SelectFormInput } from "@/modules/shared/components/form/select-form-input";

interface RootProps {
	children: React.ReactNode;
	client?: ClientDetail;
	action: "create" | "update";
	onSuccess?: () => void;
}

interface Context {
	form: UseFormReturn<CreateClientDto, unknown, CreateClientDto>;
	action: "create" | "update";
	isPending: boolean;
	client?: ClientDetail;
	onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
	clearForm: () => void;
}

const ClientFormContext = createContext<Context | null>(null);

function useClientForm() {
	const context = use(ClientFormContext);

	if (!context) {
		throw new Error(
			"useClientForm must be used within a ClientFormContext.Provider",
		);
	}

	return context;
}

const numOfInstallments = Array.from({ length: 12 }, (_, i) => ({
	id: (i + 1).toString(),
	label: `${(i + 1).toString()} ${i + 1 === 1 ? "couta (Pago único)" : "cuotas"}`,
}));

const frecuencyItems = [
	{ id: "weekly", label: "Semanal" },
	{ id: "biweekly", label: "Quincenal" },
	{ id: "monthly", label: "Mensual" },
];

function Root({ action, children, client, onSuccess }: RootProps) {
	if (action === "update" && !client) {
		throw new Error("ClientForm.Root must have a client");
	}

	const { update, create } = useMutateClients();
	const form = useForm<CreateClientDto>({
		resolver: zodResolver(createClientDto),
		defaultValues: client
			? {
					fullName: client.fullName,
					creditLimit: client.creditLimit,
					clientCode: client.clientCode,
					globalInstallmentModality: client.globalInstallmentModality,
					globalNumberOfInstallments: client.globalNumberOfInstallments,
					address: client.address,
					email: client.email,
					phone: client.phone,
				}
			: {
					fullName: "",
					creditLimit: 0,
					clientCode: "",
					globalInstallmentModality: "monthly",
					globalNumberOfInstallments: 1,
				},
	});

	const onSubmit = form.handleSubmit(async (data) => {
		if (action === "create") {
			create.mutate(
				{
					...data,
					address: data.address ? data.address : undefined,
					email: data.email ? data.email : undefined,
					phone: data.phone ? data.phone : undefined,
				},
				{
					onSuccess: () => {
						onSuccess?.();
						form.reset();
					},
				},
			);
		}

		if (action === "update" && client) {
			update.mutate(
				{
					clientId: client.id,
					...data,
					address: data.address ? data.address : undefined,
					email: data.email ? data.email : undefined,
					phone: data.phone ? data.phone : undefined,
				},
				{
					onSuccess: () => {
						form.reset();
					},
				},
			);
		}
	});

	const clearForm = () => {
		form.reset();
	};

	return (
		<ClientFormContext.Provider
			value={{
				action,
				client,
				form,
				isPending: create.isPending || update.isPending,
				onSubmit,
				clearForm,
			}}
		>
			<Form {...form}>
				<form
					onSubmit={onSubmit}
					className="space-y-5"
					id={client ? `update-client-${client.id}` : "create-client"}
				>
					{children}
				</form>
			</Form>
		</ClientFormContext.Provider>
	);
}

function Submit() {
	const { action, isPending, client } = useClientForm();

	return (
		<Button
			className="w-full flex-1 flex-row gap-x-2"
			type="submit"
			form={client ? `update-client-${client.id}` : "create-client"}
		>
			{isPending && (
				<Loader2Icon size="small" color="black" className="animate-spin" />
			)}
			<span>{action === "update" ? "Editar" : "Agregar"}</span>
		</Button>
	);
}

function ClientCode() {
	const { form } = useClientForm();

	return (
		<FormInput
			control={form.control}
			label="Código del cliente"
			placeholder="Código del cliente"
			name="clientCode"
			required
		/>
	);
}

function FullName() {
	const { form } = useClientForm();

	return (
		<FormInput
			control={form.control}
			label="Nombre completo"
			placeholder="Nombre completo"
			name="fullName"
			required
		/>
	);
}

function Email() {
	const { form } = useClientForm();

	return (
		<FormInput
			control={form.control}
			label="Correo electrónico"
			placeholder="Correo electrónico"
			name="email"
		/>
	);
}

function Phone() {
	const { form } = useClientForm();
	return (
		<FormInput
			control={form.control}
			label="Número de teléfono"
			placeholder="Número de teléfono"
			name="phone"
		/>
	);
}

function Address() {
	const { form } = useClientForm();

	return (
		<FormInput
			control={form.control}
			label="Direccion"
			placeholder="Direccion"
			name="address"
		/>
	);
}

function CreditLimit() {
	const { form } = useClientForm();

	return (
		<FormInput
			control={form.control}
			label="Límite de crédito"
			placeholder="Límite de crédito"
			name="creditLimit"
			required
		/>
	);
}

function Modality() {
	const { form } = useClientForm();

	return (
		<SelectFormInput
			label="Modalidad de cuotas"
			control={form.control}
			name="globalInstallmentModality"
			items={frecuencyItems}
			placeholder="Selecciona una modalidad de cuotas"
		/>
	);
}

function NumberOfInstallments() {
	const { form } = useClientForm();

	return (
		<SelectFormInput
			label="Número de cuotas"
			control={form.control}
			name="globalNumberOfInstallments"
			items={numOfInstallments}
			placeholder="Selecciona el número de cuotas"
			onValueChange={(value) =>
				form.setValue("globalNumberOfInstallments", Number(value))
			}
		/>
	);
}

export const ClientForm = {
	Root,
	useClientForm,
	Submit,
	ClientCode,
	FullName,
	Email,
	Phone,
	Address,
	CreditLimit,
	Modality,
	NumberOfInstallments,
};
