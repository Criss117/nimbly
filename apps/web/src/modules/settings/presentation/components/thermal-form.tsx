import { createContext, use } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import {
	thermalInfoDto,
	type ThermalInfoDto,
} from "@/modules/settings/application/dtos/thermal-info.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectFormInput } from "@/modules/shared/components/form/select-form-input";
import { Form } from "@/modules/shared/components/ui/form";
import { Button } from "@/modules/shared/components/ui/button";
import { cn } from "@/modules/shared/lib/utils";
import { FormInput } from "@/modules/shared/components/form/form-input";

interface RootProps {
	children: React.ReactNode;
	className?: string;
	printers: string[];
	thermalInfo: ThermalInfoDto;
	onSave: (data: ThermalInfoDto) => void;
}

interface SubmitProps {
	className?: string;
}

interface Context {
	form: UseFormReturn<ThermalInfoDto, unknown, ThermalInfoDto>;
	printers: string[];
}

const ThermalFormContext = createContext<Context | null>(null);

function useThermalForm() {
	const context = use(ThermalFormContext);
	if (!context) {
		throw new Error("useThermalForm must be used within a ThermalFormProvider");
	}
	return context;
}

function Root({
	children,
	className,
	printers,
	thermalInfo,
	onSave,
}: RootProps) {
	const form = useForm<ThermalInfoDto>({
		resolver: zodResolver(thermalInfoDto),
		defaultValues: thermalInfo,
	});

	const onSubmit = form.handleSubmit((data) => {
		toast.success("Datos guardados", {
			position: "top-center",
		});
		onSave(data);
	});

	return (
		<ThermalFormContext.Provider value={{ form, printers }}>
			<Form {...form}>
				<form onSubmit={onSubmit} id="thermal-form" className={cn(className)}>
					{children}
				</form>
			</Form>
		</ThermalFormContext.Provider>
	);
}

function ThermalName() {
	const { form, printers } = useThermalForm();

	return (
		<SelectFormInput
			control={form.control}
			name="selectedThermalName"
			label="Nombre de la impresora"
			items={printers.map((name) => ({
				id: name,
				label: name,
			}))}
			placeholder="Selecciona una impresora"
		/>
	);
}

function ThermalUrl() {
	const { form } = useThermalForm();

	return (
		<FormInput
			label="URL de la impresora"
			name="url"
			control={form.control}
			disabled
		/>
	);
}

function Platform() {
	const { form } = useThermalForm();

	return (
		<FormInput
			label="Plataforma"
			name="platform"
			control={form.control}
			disabled
		/>
	);
}

function Version() {
	const { form } = useThermalForm();

	return (
		<FormInput label="Version" name="version" control={form.control} disabled />
	);
}

function Submit({ className }: SubmitProps) {
	return (
		<Button type="submit" form="thermal-form" className={cn(className)}>
			Guardar
		</Button>
	);
}

export const ThermalForm = {
	useThermalForm,
	Root,
	ThermalName,
	Submit,
	ThermalUrl,
	Platform,
	Version,
};
