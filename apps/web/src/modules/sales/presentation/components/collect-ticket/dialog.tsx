import { useState } from "react";
import { HandCoins, User2Icon } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import {
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Dialog as DialogView,
} from "@/modules/shared/components/ui/dialog";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/modules/shared/components/ui/tabs";
import { UsersList } from "./users-list";
import { Button } from "@/modules/shared/components/ui/button";
import { Label } from "@/modules/shared/components/ui/label";
import { Input } from "@/modules/shared/components/ui/input";
import { cn, formatCurrency } from "@/modules/shared/lib/utils";
import type { TicketStore } from "@/modules/sales/application/store/tickets.store";
import type { TicketType } from "@/modules/sales/application/models";
import type { CreateTicketSchema } from "@/modules/sales/application/models/create-tickets.schema";

interface DialogProps {
	ticket: TicketStore | undefined;
	form: UseFormReturn<CreateTicketSchema, unknown, CreateTicketSchema>;
}

interface DialogPayTypeSelectProps {
	total: number;
	form: UseFormReturn<CreateTicketSchema, unknown, CreateTicketSchema>;
}

function DialogActions() {
	return (
		<DialogFooter className="border w-1/2">
			<div className="w-full p-3 flex flex-col justify-between">
				<div className="space-y-3 mb-2">
					<Button
						className="w-full h-10"
						type="submit"
						form="collect-ticket-form"
					>
						Cobrar
					</Button>
				</div>
				<DialogClose asChild>
					<Button className="w-full h-10" variant="outline">
						Cerrar
					</Button>
				</DialogClose>
			</div>
		</DialogFooter>
	);
}

function DialogPayTypeSelect({ total, form }: DialogPayTypeSelectProps) {
	const [type, setType] = useState<TicketType>(form.getValues().payType);

	const handleChangeType = (value: TicketType) => {
		form.setValue("payType", value as TicketType);
		form.setValue("clientId", "");
		setType(value);
	};

	return (
		<div className="w-1/2">
			<DialogHeader>
				<DialogTitle>Cobrar</DialogTitle>
				<DialogDescription />
			</DialogHeader>
			<div className="flex flex-col justify-center items-center space-y-3">
				<p className="font-bold text-3xl">${formatCurrency(total)}</p>

				<Tabs
					className="w-full px-5"
					onValueChange={(value) => handleChangeType(value as TicketType)}
					value={type}
				>
					<TabsList className="h-20 space-x-5 px-5 mx-auto">
						<TabsTrigger
							value="cash"
							className="flex flex-col items-center justify-center cursor-pointer w-1/2"
						>
							<HandCoins className="size-8" />
							<span className="text-base">Efectivo</span>
						</TabsTrigger>
						<TabsTrigger
							value="credit"
							className="flex flex-col items-center justify-center cursor-pointer w-1/2"
						>
							<User2Icon className="size-8" />
							<span className="text-base">Crédito</span>
						</TabsTrigger>
					</TabsList>
					<TabsContent value="cash" className="mt-5 w-full">
						<DialogPayTypeSelectCashType total={total} />
					</TabsContent>
					<TabsContent value="credit">
						<UsersList form={form} />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}

function DialogPayTypeSelectCashType({ total }: { total: number }) {
	const [payWith, setPayWith] = useState(total);

	return (
		<div className="space-y-5">
			<Label className="text-base">
				<span className="w-1/3">Pago con:</span>
				<Input
					value={payWith}
					onChange={(e) => setPayWith(Number.parseFloat(e.target.value))}
					type="number"
					min={0}
					step={0.01}
					className="w-2/3"
				/>
			</Label>
			<p className="w-full flex ">
				<span className="w-1/3">Su cambio:</span>
				<span className={cn("w-2/3", total > payWith && "text-red-500")}>
					{formatCurrency(payWith - total)}
				</span>
			</p>
		</div>
	);
}

export function Dialog({ form, ticket }: DialogProps) {
	const [open, setOpen] = useState(false);

	const total = ticket
		? ticket.products.reduce(
				(acc, product) => acc + product.salePrice * product.currentStock,
				0,
			)
		: 0;

	return (
		<DialogView open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					className="h-full w-56 text-2xl font-bold"
					disabled={!ticket || total === 0}
				>
					Cobrar
				</Button>
			</DialogTrigger>
			<DialogContent className="flex min-w-5xl min-h-[calc(60dvh)]">
				<DialogPayTypeSelect form={form} total={total} />
				<DialogActions />
			</DialogContent>
		</DialogView>
	);
}
