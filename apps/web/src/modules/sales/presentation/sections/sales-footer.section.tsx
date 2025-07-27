import { useTicketsStore } from "@/modules/sales/application/store/tickets.store";
import { CollectTicketDialog } from "../components/collect-ticket-dialog";
import { SaveTicketFormStoreProvider } from "@/modules/sales/application/store/save-ticket-form.store";
import { Separator } from "@/modules/shared/components/ui/separator";
import { formatCurrency } from "@/modules/shared/lib/utils";

export function SalesFooterSection() {
	const ticket = useTicketsStore((state) => state.getCurrentTicket());

	const total = Number.parseFloat(
		(
			ticket?.products.reduce(
				(acc, p) => acc + p.currentPrice * p.currentStock,
				0,
			) || 0
		).toFixed(2),
	);

	return (
		<footer className="h-32 border-t px-20 fixed bottom-0 w-full z-30 bg-background flex py-2">
			<div className="w-9/12 flex justify-end">
				<SaveTicketFormStoreProvider>
					<CollectTicketDialog ticket={ticket} />
				</SaveTicketFormStoreProvider>
			</div>
			<Separator orientation="vertical" className="mx-5" />

			<div className="w-3/12 flex justify-center items-center">
				<p className="font-bold text-3xl">${formatCurrency(total)}</p>
			</div>
		</footer>
	);
}
