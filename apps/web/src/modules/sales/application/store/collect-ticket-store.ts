import { create } from "zustand";
import type { TicketStore } from "./tickets.store";
import type { SimpleClient } from "@/modules/clients/application/models";
import type { TicketType } from "../models";
import type { TicketCreditType } from "../models/schemas";

export type CreditInfo = {
	installments: number;
	type: TicketCreditType;
};

interface Store {
	ticket: TicketStore | null;
	type: TicketType;
	selectedClient: SimpleClient | null;
	creditInfo: CreditInfo;
	setSelectedClient: (client: SimpleClient | null) => void;
	setTicket: (ticket: TicketStore | null) => void;
	setType: (type: TicketType) => void;
	setCreditInfo: (creditInfo: CreditInfo) => void;
	clearStore: () => void;
}

export const useCollectTicketStore = create<Store>()((set) => ({
	ticket: null,
	selectedClient: null,
	type: "cash",
	creditInfo: {
		installments: 1,
		type: "global",
	},
	setSelectedClient: (client) => set({ selectedClient: client }),
	setTicket: (ticket) => set({ ticket }),
	setType: (type) => set({ type }),
	setCreditInfo: (creditInfo) => set({ creditInfo }),
	clearStore: () =>
		set({
			ticket: null,
			selectedClient: null,
			type: "cash",
			creditInfo: { installments: 1, type: "global" },
		}),
}));
