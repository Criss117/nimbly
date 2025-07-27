import { format } from "@formkit/tempo";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/modules/shared/components/ui/card";
import type { ClientDetail } from "@nimbly/core/clients";
import { cn, formatCurrency } from "@/modules/shared/lib/utils";
import { Progress } from "@/modules/shared/components/ui/progress";
import { UpdateClientDialog } from "../components/update-client-dialog";
import { PayDebt } from "../components/pay-debt";
import { SettleDebt } from "../components/settle-debt";
import { PaysList } from "../components/pays-list";

interface Props {
	client: ClientDetail;
}

function progressColor({ value }: { value: number }) {
	switch (true) {
		case value > 80:
			return "bg-red-500/20 [&>div]:bg-red-500";
		case value > 50:
			return "bg-yellow-500/20 [&>div]:bg-yellow-500";
		default:
			return "bg-green-500/20 [&>div]:bg-green-500";
	}
}

export function ClientHeaderSection({ client }: Props) {
	const creditPercent = (client.totalDebt / client.creditLimit) * 100;

	return (
		<header>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<div className="space-y-1 w-3/4">
						<CardTitle className="text-2xl space-x-2 flex items-center">
							<UpdateClientDialog client={client} />
							<span>{client.fullName}</span>
						</CardTitle>
						<CardDescription>
							Cliente desde{" "}
							{format({
								date: client.createdAt,
								format: "long",
								locale: "es-ES",
							})}
						</CardDescription>
					</div>
					<div className="w-2/4 flex gap-x-2">
						<PaysList clientId={client.id} />
						<PayDebt
							clientId={client.id}
							hasDebt={client.totalDebt > 0}
							totalDebt={client.totalDebt}
						/>
						<SettleDebt clientId={client.id} hasDebt={client.totalDebt > 0} />
					</div>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-4">
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">Límite de Crédito</span>
								<span className="font-medium text-normal">
									${formatCurrency(client.creditLimit)}
								</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">Deuda Actual</span>
								<span className="font-medium text-lg">
									${formatCurrency(client.totalDebt)}
								</span>
							</div>
							<Progress
								value={creditPercent}
								className={cn("h-2", progressColor({ value: creditPercent }))}
							/>

							<div className="grid grid-cols-2 gap-4">
								<div className="flex flex-col space-y-1">
									<span className="text-xs text-muted-foreground">
										Teléfono
									</span>
									<span className="text-sm font-medium">
										{client.phone || "-"}
									</span>
								</div>
								<div className="flex flex-col space-y-1">
									<span className="text-xs text-muted-foreground">Email</span>
									<span className="text-sm font-medium">
										{client.email || "-"}
									</span>
								</div>
								<div className="flex flex-col space-y-1">
									<span className="text-xs text-muted-foreground">
										Última Compra
									</span>
									<span className="text-sm font-medium">
										{client.lastTicketDate
											? format({
													date: client.lastTicketDate,
													format: "full",
													locale: "es-ES",
												})
											: "No hay compras recientes"}
									</span>
								</div>
								<div className="flex flex-col space-y-1">
									<span className="text-xs text-muted-foreground">
										ID Cliente
									</span>
									<span className="text-sm font-medium">
										{client.clientCode}
									</span>
								</div>
								<div className="flex flex-col space-y-1">
									<span className="text-xs text-muted-foreground">
										Dirección
									</span>
									<span className="text-sm font-medium">
										{client.address || "-"}
									</span>
								</div>
							</div>
						</div>

						<div className="space-y-4 ">
							<div className="grid grid-cols-3 gap-4">
								<Card className="bg-muted/40">
									<CardHeader className="p-4 pb-2">
										<CardDescription>Total Tickets</CardDescription>
									</CardHeader>
									<CardContent className="p-4 pt-0">
										<div className="text-2xl font-bold">
											{client.totalTickets}
										</div>
									</CardContent>
								</Card>
								<Card className="bg-muted/40">
									<CardHeader className="p-4 pb-2">
										<CardDescription>Tickets Pendientes</CardDescription>
									</CardHeader>
									<CardContent className="p-4 pt-0">
										<div className="text-2xl font-bold">
											{client.totalTicketsUnpaid}
										</div>
									</CardContent>
								</Card>
								<Card className="bg-muted/40">
									<CardHeader className="p-4 pb-2">
										<CardDescription>Tickets Pagados</CardDescription>
									</CardHeader>
									<CardContent className="p-4 pt-0">
										<div className="text-2xl font-bold">
											{client.totalTicketsPaid}
										</div>
									</CardContent>
								</Card>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</header>
	);
}
