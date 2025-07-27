import { BanknoteXIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/modules/shared/components/ui/button";
import { useMutatePayments } from "@/modules/clients/application/hooks/use.mutate-payments";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/modules/shared/components/ui/alert-dialog";

interface Props {
	clientId: string;
	hasDebt: boolean;
}

export function SettleDebt({ clientId, hasDebt }: Props) {
	const [open, setOpen] = useState(false);
	const { create } = useMutatePayments();

	const handleSettleDebt = () =>
		create.mutate(
			{ clientId, type: "settle_debt" },
			{
				onSuccess: () => setOpen(false),
			},
		);

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button className="flex-1" disabled={!hasDebt}>
					<BanknoteXIcon />
					Liquidar adeudo
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Liquidar adeudo</AlertDialogTitle>
					<AlertDialogDescription>
						Seguro que desea liquidar el adeudo?
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancelar</AlertDialogCancel>
					<Button disabled={create.isPending} onClick={handleSettleDebt}>
						Continar
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
