import { useState } from "react";
import { PlusCircleIcon } from "lucide-react";
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
import { ClientForm } from "./client-form";

function Content() {
	const { clearForm } = ClientForm.useClientForm();

	return (
		<DialogContent className="min-w-3xl">
			<DialogHeader>
				<DialogTitle>Agregar nuevo cliente</DialogTitle>
				<DialogDescription>
					Aquí podrás agregar un nuevo cliente
				</DialogDescription>
			</DialogHeader>
			<fieldset className="grid grid-cols-2 gap-y-4 gap-x-5">
				<ClientForm.ClientCode />
				<ClientForm.FullName />
				<ClientForm.Email />
				<ClientForm.Phone />
				<ClientForm.Address />
				<ClientForm.CreditLimit />
				<ClientForm.Modality />
				<ClientForm.NumberOfInstallments />
			</fieldset>

			<DialogFooter className="sm:justify-start">
				<DialogClose asChild>
					<Button
						type="button"
						variant="secondary"
						className="flex-1"
						onClick={clearForm}
					>
						Cancelar
					</Button>
				</DialogClose>
				<ClientForm.Submit />
			</DialogFooter>
		</DialogContent>
	);
}

export function CreateClientDialog() {
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<ClientForm.Root action="create" onSuccess={() => setOpen(false)}>
				<DialogTrigger asChild>
					<Button size="icon">
						<PlusCircleIcon />
					</Button>
				</DialogTrigger>
				<Content />
			</ClientForm.Root>
		</Dialog>
	);
}
