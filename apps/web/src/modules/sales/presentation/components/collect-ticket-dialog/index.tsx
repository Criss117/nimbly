import { useEffect, useState } from "react";
import { Button } from "@/modules/shared/components/ui/button";
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
import { CollectTicketDialogTabs } from "./tabs";
import { SaveTicket } from "./save-ticket";
import { useCollectTicketStore } from "@/modules/sales/application/store/collect-ticket-store";
import { Form } from "@/modules/shared/components/ui/form";
import type { TicketStore } from "@/modules/sales/application/store/tickets.store";
import { useSaveTicketForm } from "@/modules/sales/application/store/save-ticket-form.store";
import { formatCurrency } from "@/modules/shared/lib/utils";

interface Props {
	ticket: TicketStore | undefined;
}

export function CollectTicketDialog({ ticket }: Props) {
	const { form, onSubmit } = useSaveTicketForm();
	const [open, setOpen] = useState(false);
	const clearStore = useCollectTicketStore((s) => s.clearStore);

	const total = Number.parseFloat(
		(
			ticket?.products.reduce(
				(acc, p) => acc + p.currentPrice * p.currentStock,
				0,
			) || 0
		).toFixed(2),
	);

	const handleSetItems = () => {
		const items =
			ticket?.products.map((p) => ({
				quantity: p.currentStock,
				description: p.description,
				productId: p.id,
				price: p.currentPrice,
			})) || [];
		form.setValue("items", items);
	};

	const onSuccess = () => {
		setOpen(false);
		clearStore();
	};

	useEffect(() => {
		if (!open) {
			clearStore();
			form.reset();
		}
	}, [open]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					className="h-full w-56 text-2xl font-bold"
					disabled={!ticket || total === 0}
					onClick={() => handleSetItems()}
				>
					Cobrar
				</Button>
			</DialogTrigger>
			<DialogContent className="flex min-w-5xl min-h-[calc(60dvh)]">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit((data) =>
							onSubmit(data, { onSuccess }),
						)}
						className="flex justify-between w-full"
					>
						<div className="w-1/2">
							<DialogHeader>
								<DialogTitle>Cobrar</DialogTitle>
								<DialogDescription />
							</DialogHeader>
							<div className="flex flex-col justify-center items-center space-y-3">
								<p className="font-bold text-3xl">${formatCurrency(total)}</p>
								<CollectTicketDialogTabs total={total} />
							</div>
						</div>
						<DialogFooter className="border w-1/2">
							<div className="w-full p-3 flex flex-col justify-between">
								<div className="space-y-3 mb-2">
									{ticket ? (
										<SaveTicket />
									) : (
										<Button className="w-full h-10">Cobrar</Button>
									)}
								</div>
								<DialogClose asChild>
									<Button className="w-full h-10" variant="outline">
										Cerrar
									</Button>
								</DialogClose>
							</div>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
