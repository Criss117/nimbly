import type DBClient from "@nimbly/db";
import type { FindDebtInfoUseCase } from "@/clients/application/use-cases/clients/find-debt-info.usecase";
import type { ReturnFromTicketDto } from "../dtos/return-from-ticket.dto";
import type {
	TicketsCommandsRepository,
	TicketsQueriesRepository,
} from "@/tickets/domain";
import type { UpdateProductStockUseCase } from "@/products";
import type { ReduceInstallmentTotalUseCase } from "@/clients";
import type { DeleteTicketUseCase } from "./delete-ticket.usecase";

export class ReturnFormTicketUseCase {
	constructor(
		private readonly ticketsQueriesRepository: TicketsQueriesRepository,
		private readonly ticketsCommandsRepository: TicketsCommandsRepository,
		private readonly findDebtInfoUseCase: FindDebtInfoUseCase,
		private readonly updateProductStockUseCase: UpdateProductStockUseCase,
		private readonly reduceInstallmentTotalUseCase: ReduceInstallmentTotalUseCase,
		private readonly deleteTicketUseCase: DeleteTicketUseCase,
		private readonly dbClient: DBClient,
	) {}

	public async execute(data: ReturnFromTicketDto) {
		const { clientId, ticketId, ticketItemIds } = data;

		const ticket = await this.ticketsQueriesRepository.findOneTicket(
			ticketId,
			clientId,
		);

		if (!ticket) {
			throw new Error("No existe el ticket", {
				cause: "NOT_FOUND",
			});
		}

		if (ticket.status === "paid") {
			throw new Error("No puedes devolver el ticket pagado", {
				cause: "BAD_REQUEST",
			});
		}

		const itemsToDelete = ticket.items.filter((i) =>
			ticketItemIds.includes(i.id),
		);

		if (!itemsToDelete.length) {
			throw new Error("No hay items para devolver", {
				cause: "BAD_REQUEST",
			});
		}

		const totalToReturn = itemsToDelete.reduce(
			(acc, i) => acc + i.price * i.quantity,
			0,
		);

		const totalTicketDebt = ticket.total - ticket.totalPaid;

		if (totalToReturn > totalTicketDebt) {
			throw new Error("No puedes devolver más de la deuda global", {
				cause: "BAD_REQUEST",
			});
		}

		if (totalTicketDebt === totalToReturn) {
			await this.deleteTicketUseCase.execute({ ticketId, clientId });

			return;
		}

		const { totalDebt } = await this.findDebtInfoUseCase.execute(clientId);

		if (totalToReturn > totalDebt) {
			throw new Error("No puedes devolver más de la deuda global", {
				cause: "BAD_REQUEST",
			});
		}

		await this.dbClient.transaction((tx) => {
			const updateInstallmentPromise =
				this.reduceInstallmentTotalUseCase.execute(clientId, totalToReturn, tx);

			const updateStockPromises = itemsToDelete.map((i) =>
				this.updateProductStockUseCase.execute(
					{
						productId: i.productId,
						quantity: i.quantity,
						byReturn: true,
					},
					tx,
				),
			);

			const updateTicketPromise =
				this.ticketsCommandsRepository.deleteTicketItems(data, tx);

			return Promise.all([
				...updateStockPromises,
				updateTicketPromise,
				updateInstallmentPromise,
			]);
		});
	}
}
