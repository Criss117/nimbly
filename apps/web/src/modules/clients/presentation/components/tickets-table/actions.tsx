import { useState } from "react";
import { MoreVerticalIcon, Trash2Icon } from "lucide-react";

import { useMutateTickets } from "@/modules/clients/application/hooks/use.mutate-tickets";
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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/modules/shared/components/ui/dropdown-menu";
import { Button } from "@/modules/shared/components/ui/button";
import { TicketItemsList } from "./items-list.actions";

interface Props {
	children?: React.ReactNode;
}

interface DeleteTicketProps {
	clientId: string;
	ticketId: number;
}

function Menu({ children }: Props) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon">
					<MoreVerticalIcon />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-[150px]">
				<DropdownMenuGroup className="space-y-2">{children}</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function DeleteTicket({ clientId, ticketId }: DeleteTicketProps) {
	const [isOpen, setIsOpen] = useState(false);

	const { deleteTicket } = useMutateTickets();

	const onDelete = () => {
		deleteTicket.mutate(
			{
				clientId,
				ticketId,
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
					<Button variant="destructive" className="w-full">
						<Trash2Icon />
						Eliminar
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

function CanontDeleteTicket() {
	return (
		<DropdownMenuItem onClick={(e) => e.preventDefault()} asChild>
			<Dialog>
				<DialogTrigger asChild>
					<Button
						variant="destructive"
						className="opacity-50 cursor-default w-full"
					>
						<Trash2Icon />
						Eliminar
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>No puede eliminar el ticket</DialogTitle>
						<DialogDescription>
							Este ticket tiene un pago asignado y no puede ser eliminado.
							<br />
							Eliminar el ticket puede causar pérdidas de datos.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<DialogClose asChild>
							<Button variant="outline">Cerrar</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</DropdownMenuItem>
	);
}

export const Actions = {
	Menu,
	TicketItemsList,
	DeleteTicket,
	CanontDeleteTicket,
};
