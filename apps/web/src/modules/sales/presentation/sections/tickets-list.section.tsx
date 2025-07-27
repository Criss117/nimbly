import { useTicketsStore } from "@/modules/sales/application/store/tickets.store";
import {
	Tabs,
	TabsContent,
	TabsList,
} from "@/modules/shared/components/ui/tabs";
import { TicketContextMenu } from "../components/ticket-context-menu";
import { ProductsSaleTable } from "../components/products-sale-table";
import { AddTicketPopover } from "../components/add-ticket-popover";

export function TicketsListSection() {
	const tickets = useTicketsStore((state) => state.tickets);
	const selectedId = useTicketsStore((state) => state.selectedId);
	const setSelectedKey = useTicketsStore((state) => state.setSelectedId);

	return (
		<>
			<div className="flex gap-x-5 relative">
				<AddTicketPopover />
				<Tabs
					defaultValue={selectedId.toString()}
					value={selectedId.toString()}
					onValueChange={(value) => setSelectedKey(Number.parseInt(value))}
					className="w-full"
				>
					<TabsList className="mx-14">
						{tickets.map(({ id, name }) => (
							<TicketContextMenu id={id} name={name} key={id} />
						))}
					</TabsList>
					{tickets.map(({ id, products }) => (
						<TabsContent value={id.toString()} key={id}>
							<ProductsSaleTable products={products} key={products.length} />
						</TabsContent>
					))}
				</Tabs>
			</div>
		</>
	);
}
