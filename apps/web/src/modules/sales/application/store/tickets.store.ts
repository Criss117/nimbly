import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TicketProduct } from "../models";

export type TicketStore = {
	id: number;
	name: string;
	products: TicketProduct[];
};

export interface Store {
	tickets: TicketStore[];
	selectedProductIds: number[];
	selectedId: number;
	setSelectedProductIds: (id: number) => void;
	addTicket: (name: string) => void;
	removeTicket: (id: number) => void;
	setSelectedId: (id: number) => void;
	addProduct: (product: TicketProduct) => void;
	changeProduct: (
		id: number,
		data: { newStock: number; newCurrentPrice: number },
	) => void;
	getCurrentTicket: () => TicketStore | undefined;
	removeProduct: (id: number) => void;
	clearCurrentTicket: () => void;
	toWholesale: () => void;
	selectAllProducts: () => void;
}

const defaultTicket: TicketStore = {
	id: 1,
	name: "ticket-1",
	products: [],
};

export const useTicketsStore = create<Store>()(
	persist(
		(set, get) => ({
			tickets: [defaultTicket],
			selectedId: defaultTicket.id,
			selectedProductIds: [],
			addTicket: (name: string) => {
				set((state) => {
					if (state.tickets.find((t) => t.name === name)) {
						toast.error("Ya existe un ticket con ese nombre");
						return state;
					}

					const newId =
						state.tickets.reduce((acc, t) => Math.max(acc, t.id), 0) + 1;

					return {
						tickets: [...state.tickets, { id: newId, name, products: [] }],
						selectedId: newId,
					};
				});
			},
			removeTicket: (id: number) => {
				set((state) => {
					const newTickets = state.tickets.filter((t) => t.id !== id);

					if (newTickets.length === 0) {
						return {
							tickets: [defaultTicket],
							selectedId: defaultTicket.id,
						};
					}

					return {
						tickets: newTickets,
						selectedId:
							state.selectedId === id ? newTickets[0].id : state.selectedId,
					};
				});
			},
			getCurrentTicket: () => {
				return get().tickets.find((t) => t.id === get().selectedId);
			},
			setSelectedId: (id: number) => {
				set((state) => {
					if (!state.tickets.some((t) => t.id === id)) {
						toast.error("No existe un ticket con ese id");
						return state;
					}

					return {
						selectedId: id,
					};
				});
			},
			addProduct: (product: TicketProduct) => {
				set((state) => {
					if (product.stock === 0) {
						toast.error("El producto no tiene stock");
						return state;
					}

					const ticket = state.getCurrentTicket();

					if (!ticket) {
						toast.error("No hay tickets seleccionados");
						return state;
					}

					const existingProduct = ticket.products.find(
						(p) => p.barcode === product.barcode,
					);

					if (existingProduct) {
						if (
							existingProduct.stock - (existingProduct.currentStock + 1) <
							0
						) {
							toast.error("El producto no tiene stock");
							return state;
						}

						const newProducts = ticket.products.map((p) => {
							if (p.barcode !== product.barcode) return p;

							return {
								...p,
								currentStock: p.currentStock + 1,
							};
						});

						return {
							tickets: state.tickets.map((t) => {
								if (t.id !== state.selectedId) return t;

								return {
									...t,
									products: newProducts,
								};
							}),
						};
					}

					return {
						tickets: state.tickets.map((t) => {
							if (t.id === state.selectedId) {
								return {
									...t,
									products: [...t.products, product],
								};
							}

							return t;
						}),
					};
				});
			},
			changeProduct: (id, data) => {
				const { newCurrentPrice, newStock } = data;
				set((state) => {
					const ticket = state.getCurrentTicket();

					if (!ticket) {
						toast.error("No hay tickets seleccionados");
						return state;
					}

					const existingProduct = ticket.products.find((p) => p.id === id);

					if (!existingProduct) {
						toast.error("No existe un producto con ese id");
						return state;
					}

					if (existingProduct.stock - newStock < 0) {
						toast.error("El producto no tiene stock");
						return state;
					}

					const newProducts = ticket.products.map((p) => {
						if (p.id !== id) return p;

						return {
							...p,
							currentStock: newStock > 0 ? newStock : 0,
							currentPrice: newCurrentPrice,
						};
					});

					return {
						tickets: state.tickets.map((t) => {
							if (t.id !== state.selectedId) return t;

							return {
								...t,
								products: newProducts,
							};
						}),
					};
				});
			},
			removeProduct: (id: number) => {
				set((state) => {
					const ticket = state.getCurrentTicket();

					if (!ticket) {
						toast.error("No hay tickets seleccionados");
						return state;
					}

					const newProducts = ticket.products.filter((p) => p.id !== id);

					return {
						tickets: state.tickets.map((t) => {
							if (t.id !== state.selectedId) return t;

							return {
								...t,
								products: newProducts,
							};
						}),
					};
				});
			},
			clearCurrentTicket: () => {
				set((state) => {
					return {
						tickets: state.tickets.map((t) => {
							if (t.id !== state.selectedId) return t;

							return {
								...t,
								products: [],
							};
						}),
					};
				});
			},
			setSelectedProductIds: (productId: number) => {
				set((state) => {
					const existingId = state.selectedProductIds.find(
						(id) => id === productId,
					);
					if (existingId) {
						return {
							selectedProductIds: state.selectedProductIds.filter(
								(id) => id !== existingId,
							),
						};
					}

					return {
						selectedProductIds: [...state.selectedProductIds, productId],
					};
				});
			},
			toWholesale: () => {
				set((state) => {
					const ticket = state.getCurrentTicket();

					if (!ticket) {
						toast.error("No hay tickets seleccionados");
						return state;
					}

					const selectedProductsIds = state.selectedProductIds;

					if (selectedProductsIds.length === 0) {
						toast.error("No hay productos seleccionados");
						return state;
					}

					const newProducts = ticket.products.map((p) => {
						if (!selectedProductsIds.includes(p.id)) return p;

						return {
							...p,
							currentPrice:
								p.currentPrice === p.wholesalePrice
									? p.salePrice
									: p.wholesalePrice,
						};
					});

					return {
						tickets: state.tickets.map((t) => {
							if (t.id !== state.selectedId) return t;

							return {
								...t,
								products: newProducts,
							};
						}),
					};
				});
			},
			selectAllProducts: () => {
				set((state) => {
					const productLength = state.getCurrentTicket()?.products.length || 0;
					if (state.selectedProductIds.length === productLength) {
						return {
							selectedProductIds: [],
						};
					}

					const ticket = state.getCurrentTicket();

					if (!ticket) {
						toast.error("No hay tickets seleccionados");
						return state;
					}

					const selectedProductsIds = new Set(state.selectedProductIds);

					for (const product of ticket.products) {
						selectedProductsIds.add(product.id);
					}

					return {
						selectedProductIds: Array.from(selectedProductsIds),
					};
				});
			},
		}),
		{ name: "nymbli_tickets" },
	),
);
