import { toast } from "sonner";
import { createContext, use } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import {
	businessInfoDto,
	type BusinessInfoDto,
} from "@/modules/settings/application/dtos/business-info.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "@/modules/shared/components/form/form-input";
import { Form } from "@/modules/shared/components/ui/form";
import { Button } from "@/modules/shared/components/ui/button";

interface Context {
	form: UseFormReturn<BusinessInfoDto, unknown, BusinessInfoDto>;
}

interface RootProps {
	onSave: (data: BusinessInfoDto) => void;
	values?: BusinessInfoDto;
	children: React.ReactNode;
}

const BusinnesFormContext = createContext<Context | null>(null);

function useBusinessForm() {
	const context = use(BusinnesFormContext);

	if (context === null) {
		throw new Error(
			"useBusinessForm must be used within a BusinessFormProvider",
		);
	}

	return context;
}

function Root({ children, values, onSave }: RootProps) {
	const form = useForm<BusinessInfoDto>({
		resolver: zodResolver(businessInfoDto),
		defaultValues: values ?? {
			name: "",
			address: "",
			nit: "",
		},
	});

	const onSubmit = form.handleSubmit((data) => {
		toast.success("Datos guardados", {
			position: "top-center",
		});
		onSave(data);
	});

	return (
		<BusinnesFormContext.Provider
			value={{
				form,
			}}
		>
			<Form {...form}>
				<form onSubmit={onSubmit} id="business-form">
					{children}
				</form>
			</Form>
		</BusinnesFormContext.Provider>
	);
}

function Name() {
	const { form } = useBusinessForm();

	return (
		<FormInput
			label="Nombre de la empresa"
			name="name"
			control={form.control}
			required
		/>
	);
}

function Address() {
	const { form } = useBusinessForm();

	return (
		<FormInput
			label="Dirección de la empresa"
			name="address"
			control={form.control}
			required
		/>
	);
}

function NIT() {
	const { form } = useBusinessForm();

	return (
		<FormInput
			label="NIT de la empresa"
			name="nit"
			control={form.control}
			required
		/>
	);
}

function Submit() {
	return (
		<Button type="submit" form="business-form">
			Guardar
		</Button>
	);
}

export const BusinessForm = {
	useBusinessForm,
	Name,
	Root,
	Address,
	NIT,
	Submit,
};
