export const ticketStatus = ["unpaid", "partial", "paid"] as const;
export const ticketCreditType = ["global", "individual"] as const;
export const installmentModality = ["weekly", "monthly", "biweekly"] as const;
export const payType = ["cash", "credit"] as const;

export type TicketCreditType = (typeof ticketCreditType)[number];
export type TicketStatus = (typeof ticketStatus)[number];
export type InstallmentModality = (typeof installmentModality)[number];
export type PayType = (typeof payType)[number];
