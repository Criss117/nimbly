import { Trash2Icon } from "lucide-react";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "@/modules/shared/components/ui/context-menu";
import { TabsTrigger } from "@/modules/shared/components/ui/tabs";
import { useTicketsStore } from "@/modules/sales/application/store/tickets.store";

interface Props {
	id: number;
	name: string;
}

export function TicketContextMenu({ id, name }: Props) {
	const removeTicket = useTicketsStore((state) => state.removeTicket);

	return (
		<ContextMenu>
			<TabsTrigger
				value={id.toString()}
				className="w-32 cursor-pointer"
				asChild
			>
				<ContextMenuTrigger>{name}</ContextMenuTrigger>
			</TabsTrigger>
			<ContextMenuContent>
				<ContextMenuItem variant="destructive" onClick={() => removeTicket(id)}>
					<Trash2Icon /> Eliminar
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}
