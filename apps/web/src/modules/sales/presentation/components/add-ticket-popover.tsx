import { useState } from "react";
import { PlusCircleIcon } from "lucide-react";
import { Button } from "@/modules/shared/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/modules/shared/components/ui/popover";
import { useTicketsStore } from "@/modules/sales/application/store/tickets.store";
import { Input } from "@/modules/shared/components/ui/input";

export function AddTicketPopover() {
	const addTicket = useTicketsStore((state) => state.addTicket);
	const [formState, setFormState] = useState({
		name: "",
		error: "",
	});

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!formState.name) {
			setFormState({
				name: "",
				error: "El nombre del ticket es requerido",
			});
			return;
		}

		addTicket(formState.name);
		setFormState({
			name: "",
			error: "",
		});
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button size="icon" className="absolute left-0">
					<PlusCircleIcon />
				</Button>
			</PopoverTrigger>
			<PopoverContent>
				<form onSubmit={handleSubmit} className="space-y-5">
					<fieldset>
						<Input
							placeholder="Nombre del ticket"
							value={formState.name}
							onChange={(e) =>
								setFormState((pre) => ({
									...pre,
									name: e.target.value,
								}))
							}
						/>
						{formState.error && (
							<p className="text-red-500 text-sm">{formState.error}</p>
						)}
					</fieldset>
					<Button type="submit" className="w-full">
						Crear
					</Button>
				</form>
			</PopoverContent>
		</Popover>
	);
}
