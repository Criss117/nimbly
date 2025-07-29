import { ListCollapseIcon } from "lucide-react";
import { Button } from "@/modules/shared/components/ui/button";
import type { TicketDetail } from "@nimbly/core/tickets";
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
import { DropdownMenuItem } from "@/modules/shared/components/ui/dropdown-menu";
import { TicketItemsTable } from "../tickets-items-table";
import { ScrollArea } from "@/modules/shared/components/ui/scroll-area";
import { useMutateTickets } from "@/modules/clients/application/hooks/use.mutate-tickets";
import { useState } from "react";
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
	ticket: TicketDetail;
}

function DeleteTicket({ ticket }: Props) {
	const [isOpen, setIsOpen] = useState(false);

	const { deleteTicket } = useMutateTickets();

	const onDelete = () => {
		deleteTicket.mutate(
			{
				clientId: ticket.clientId as string,
				ticketId: ticket.id,
			},
			{
				onSuccess: () => setIsOpen(false),
			},
		);
	};

	return (
		<DropdownMenuItem onClick={(e) => e.preventDefault()} asChild>
			<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
				<AlertDialogTrigger asChild>
					<Button className="flex-1" variant="destructive">
						Devolver {ticket.items.length} articulo(s)
					</Button>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Está seguro de eliminar el ticket?
						</AlertDialogTitle>
						<AlertDialogDescription>
							Esta accion se eliminará de forma permanente y podrá recuperarse
							en cualquier momento.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancelar</AlertDialogCancel>
						<Button onClick={onDelete} disabled={deleteTicket.isPending}>
							Continuar
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</DropdownMenuItem>
	);
}

function TicketItemsListFooter({ ticket }: Props) {
	const { table } = TicketItemsTable.useTicketItemsTable();
	const { returnFromTicket } = useMutateTickets();

	const selectedRows = table.getFilteredSelectedRowModel().rows;
	const selectedItemIds = selectedRows.map((row) => row.original.id);

	const onDelete = () => {
		if (selectedRows.length === 0) {
			return;
		}

		returnFromTicket.mutate(
			{
				clientId: ticket.clientId as string,
				ticketId: ticket.id,
				ticketItemIds: selectedItemIds,
			},
			{
				onSuccess: () => {
					table.setRowSelection({});
				},
			},
		);
	};

	return (
		<DialogFooter>
			<DialogClose asChild>
				<Button variant="outline" className="flex-1" type="submit">
					Cerrar
				</Button>
			</DialogClose>
			{ticket.status !== "paid" &&
				(ticket.items.length === selectedRows.length ? (
					<DeleteTicket ticket={ticket} />
				) : (
					<Button
						className="flex-1"
						variant="destructive"
						disabled={selectedRows.length === 0}
						onClick={onDelete}
					>
						Devolver {table.getFilteredSelectedRowModel().rows.length}{" "}
						articulo(s)
					</Button>
				))}
		</DialogFooter>
	);
}

export function TicketItemsList({ ticket }: Props) {
	return (
		<DropdownMenuItem onClick={(e) => e.preventDefault()} asChild>
			<Dialog>
				<DialogTrigger asChild>
					<Button className="w-full" variant="outline" size="sm">
						<ListCollapseIcon />
						Ver detalles
					</Button>
				</DialogTrigger>
				<DialogContent className="min-w-2xl">
					<DialogHeader>
						<DialogTitle>Detalle del ticket</DialogTitle>
						<DialogDescription>
							Aquí verás todos los detalles del ticket
						</DialogDescription>
					</DialogHeader>
					<TicketItemsTable.Root
						values={{
							items: ticket.items,
						}}
					>
						<ScrollArea className="max-h-96">
							<TicketItemsTable.TableContainer>
								<TicketItemsTable.Header />
								<TicketItemsTable.Body />
							</TicketItemsTable.TableContainer>
						</ScrollArea>
						{ticket.clientId && <TicketItemsListFooter ticket={ticket} />}
					</TicketItemsTable.Root>
					{!ticket.clientId && (
						<DialogFooter>
							<DialogClose asChild>
								<Button variant="outline" className="flex-1" type="submit">
									Cerrar
								</Button>
							</DialogClose>
						</DialogFooter>
					)}
				</DialogContent>
			</Dialog>
		</DropdownMenuItem>
	);
}
