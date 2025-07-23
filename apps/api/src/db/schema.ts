import { schemas } from "@nimbly/db";

export const categories = schemas.tables.categories;
export const products = schemas.tables.products;
export const clients = schemas.tables.clients;
export const tickets = schemas.tables.tickets;
export const ticketItems = schemas.tables.ticketItems;
export const installmentPlans = schemas.tables.installmentPlans;
export const installmentPayments = schemas.tables.installmentPayments;
export const payments = schemas.tables.payments;

export const categoryRelations = schemas.relations.categoryRelations;
export const productRelations = schemas.relations.productRelations;
export const clientRelations = schemas.relations.clientRelations;
export const ticketRelations = schemas.relations.ticketRelations;
export const ticketItemRelations = schemas.relations.ticketItemRelations;
export const installmentPlanRelations =
	schemas.relations.installmentPlanRelations;
export const installmentPaymentRelations =
	schemas.relations.installmentPaymentRelations;
export const paymentRelations = schemas.relations.paymentRelations;
