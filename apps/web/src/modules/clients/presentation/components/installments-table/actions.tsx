import { ListCollapseIcon, MoreVerticalIcon } from "lucide-react";
import type { InstallmentPlanDetail } from "@nimbly/core/clients";
import { format } from "@formkit/tempo";
import { Button } from "@/modules/shared/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/modules/shared/components/ui/dropdown-menu";
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
import { StatusBadge } from "@/modules/shared/components/status-badge";
import { formatCurrency } from "@/modules/shared/lib/utils";
import { ScrollArea } from "@/modules/shared/components/ui/scroll-area";

interface Props {
	children?: React.ReactNode;
}

interface PaymenstListProps {
	values: InstallmentPlanDetail;
}

function Menu({ children }: Props) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon">
					<MoreVerticalIcon />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuGroup>{children}</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function PaymentsList({ values }: PaymenstListProps) {
	return (
		<DropdownMenuItem onClick={(e) => e.preventDefault()}>
			<Dialog>
				<DialogTrigger className="flex items-center gap-x-1.5">
					<ListCollapseIcon />
					Ver detalles
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Lista de coutas</DialogTitle>
						<DialogDescription>
							Aquí verás todas las cuotas de pago
						</DialogDescription>
						<ScrollArea className="max-h-96">
							<div className="space-y-2">
								{values.installments.map((installment) => (
									<div
										key={installment.id}
										className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border p-3 shadow-sm justify-between"
									>
										<header className="items-start space-y-1 justify-between flex">
											<div className="flex items-center space-x-2 ">
												<p>
													Número de couta:{" "}
													<span>{installment.installmentNumber}</span>
												</p>
												<StatusBadge
													value={installment.status}
													className="w-fit"
												/>
											</div>

											<div className="flex items-end flex-col">
												<p className="text-sm font-normal">
													Fecha límite de pago
												</p>
												<p className="text-muted-foreground text-sm">
													{format({
														date: installment.dueDate,
														format: "long",
														locale: "es-ES",
													})}
												</p>
											</div>
										</header>
										<div className="flex justify-between">
											<div>
												<p className="text-sm">Total</p>
												<p className="text-muted-foreground">
													{formatCurrency(installment.subtotal)}
												</p>
											</div>
											<div className="flex items-end flex-col">
												<p className="text-sm">Total Pagado</p>
												<p className="text-muted-foreground">
													{formatCurrency(installment.subtotalPaid)}
												</p>
											</div>
										</div>
									</div>
								))}
							</div>
						</ScrollArea>
						<DialogFooter>
							<DialogClose asChild>
								<Button variant="outline">Cerrar</Button>
							</DialogClose>
						</DialogFooter>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</DropdownMenuItem>
	);
}

export const Actions = {
	Menu,
	PaymentsList,
};
