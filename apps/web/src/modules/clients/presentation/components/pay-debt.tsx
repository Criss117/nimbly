import { useState } from "react";
import { BanknoteArrowUpIcon, Terminal } from "lucide-react";
import { useForm } from "react-hook-form";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/modules/shared/components/ui/button";
import { Form } from "@/modules/shared/components/ui/form";
import { FormInput } from "@/modules/shared/components/form/form-input";
import { useMutatePayments } from "../../application/hooks/use.mutate-payments";
import { payDebtDto, type PayDebtDto } from "@nimbly/core/clients";
import {
	Alert,
	AlertDescription,
	AlertTitle,
} from "@/modules/shared/components/ui/alert";

interface Props {
	clientId: string;
	hasDebt: boolean;
	totalDebt: number;
}

export function PayDebt({ clientId, hasDebt, totalDebt }: Props) {
	const [open, setOpen] = useState(false);
	const { create } = useMutatePayments();
	const form = useForm<PayDebtDto>({
		resolver: zodResolver(payDebtDto),
		defaultValues: {
			amount: 0,
			type: "pay_debt",
			clientId,
		},
	});
	const currentAmount = Number.parseInt(
		form.watch("amount")?.toString() ?? "0",
	);

	const onSubmit = form.handleSubmit((data) => {
		if (!hasDebt) return;
		create.mutate(
			{
				clientId: data.clientId,
				amount: data.amount ? data.amount : undefined,
				type: data.type,
			},
			{
				onSuccess: () => {
					form.reset();
					setOpen(false);
				},
			},
		);
	});

	return (
		<Dialog
			open={open}
			onOpenChange={(value) => {
				if (value === false) {
					form.reset();
				}
				setOpen(value);
			}}
		>
			<DialogTrigger asChild>
				<Button
					className="flex-1 rounded-sm flex-row gap-x-1 items-center"
					disabled={!hasDebt}
				>
					<BanknoteArrowUpIcon />
					Abonar
				</Button>
			</DialogTrigger>
			<DialogContent className="rounded-sm mx-auto">
				<DialogHeader>
					<DialogTitle>Abonar</DialogTitle>
					<DialogDescription>¿Cuánto desea abonar?</DialogDescription>
				</DialogHeader>

				{currentAmount >= totalDebt && (
					<Alert variant="destructive">
						<Terminal />
						<AlertTitle>Se liquidará el crédito</AlertTitle>
						<AlertDescription>
							{currentAmount > totalDebt && (
								<span>
									La cantidad ingresada es mayor a la deuda del cliente, al
									continuar la operación se liquidará el adeudo. El exedente no
									se registrará como pago.
								</span>
							)}
							{currentAmount === totalDebt && (
								<span>
									La cantidad ingresada es igual la deuda del cliente, al
									continuar la operación se liquidará el adeudo.
								</span>
							)}
						</AlertDescription>
					</Alert>
				)}
				<Form {...form}>
					<form onSubmit={onSubmit} id="pay-debt-form">
						<FormInput
							control={form.control}
							name="amount"
							label="Cantidad"
							placeholder="Cantidad a abonar"
							type="number"
						/>
					</form>
				</Form>

				<DialogFooter className="flex-row gap-x-2">
					<DialogClose asChild>
						<Button variant="outline" className="flex-1" type="submit">
							Cancelar
						</Button>
					</DialogClose>
					<Button
						className="flex-1 flex-row gap-x-1.5"
						disabled={create.isPending}
						form="pay-debt-form"
						type="submit"
					>
						Continuar
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
