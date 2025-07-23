import type DBClient from "@nimbly/db";
import type { TX } from "@nimbly/db";
import type { UpdateProductStockUseCase } from "@/products";
import type { TicketsCommandsRepository } from "@/tickets/domain";
import type { CreateTicketDto } from "../dtos/create-ticket.dto";
import type { CreateInstallmentPlanUseCase } from "@/clients";

export class CreateTicketUseCase {
	constructor(
		private readonly ticketsCommandsRepository: TicketsCommandsRepository,
		private readonly updateProductStockUseCase: UpdateProductStockUseCase,
		private readonly createInstallmentPlanUseCase: CreateInstallmentPlanUseCase,
		private readonly dbClient: DBClient,
	) {}

	public async execute(data: CreateTicketDto) {
		if (data.payType === "cash") {
			await this.createAndUpdateStock({
				items: data.items,
				payType: data.payType,
				clientId: data.clientId,
			});

			return;
		}

		if (!data.clientId) {
			throw new Error("Client id is required", {
				cause: "BAD_REQUEST",
			});
		}

		return this.createCreditTicket(data);
	}

	private async createCreditTicket(data: CreateTicketDto) {
		const { items, ...ticket } = data;

		const total = items.reduce((acc, t) => acc + t.price * t.quantity, 0);

		return this.dbClient.transaction(async (tx) => {
			if (!ticket.clientId) {
				throw new Error("Client id is required", {
					cause: "BAD_REQUEST",
				});
			}
			await this.createAndUpdateStock(
				{
					items: items,
					payType: ticket.payType,
					clientId: ticket.clientId,
				},
				tx,
			);

			await this.createInstallmentPlanUseCase.execute(
				{
					clientId: ticket.clientId,
					total: total,
				},
				tx,
			);
		});
	}

	private async createAndUpdateStock(data: CreateTicketDto, tx?: TX) {
		const transaction = async (dbTX: TX) => {
			const ticketId = await this.ticketsCommandsRepository.createTicket(
				data,
				dbTX,
			);

			const updateStockPromises = data.items.map((i) =>
				this.updateProductStockUseCase.execute(
					{
						productId: i.productId,
						quantity: i.quantity,
					},
					dbTX,
				),
			);

			await Promise.all(updateStockPromises);

			return ticketId;
		};

		if (tx) {
			return tx.transaction(transaction);
		}

		return this.dbClient.transaction(transaction);
	}
}
