import fs from "node:fs";
import path from "node:path";
import { faker } from "@faker-js/faker";
import DBClient from "@nimbly/db";
import { schemas } from "@nimbly/db";

const {
	categories,
	clients,
	installmentPayments,
	installmentPlans,
	payments,
	products,
	ticketItems,
	tickets,
} = schemas.tables;

const dbClient = new DBClient("file:./local.db");

type Producto = {
	Codigo: string;
	Descripcion: string;
	"Precio Costo": string;
	"Precio Venta": string;
	"Precio Mayoreo": string;
	Inventario: number | "N/A";
	"Inv. Minimo": number | "N/A";
	Departamento: string;
	FIELD9: string;
	FIELD10: string;
	FIELD11: string;
	FIELD12: string;
	FIELD13: string;
};

type InsertProduct = typeof products.$inferInsert;
type InsertCategory = typeof categories.$inferInsert;

function convertNumber(str: string) {
	if (str === "N/A") {
		return 0;
	}

	return Number.parseInt(str.replace(/[^\d]/g, ""), 10);
}

function generateCategories() {
	const names = new Set<string>();

	while (names.size <= 5) {
		names.add(faker.commerce.department());
	}

	return Array.from({ length: 5 }).map((_, i) => {
		const date = new Date(Date.now() + i * 1000);
		return {
			id: i + 1,
			name: Array.from(names)[i],
			description: faker.food.description(),
			createdAt: date,
			updatedAt: date,
		};
	});
}

function generateCategoriesFromCSV(): InsertCategory[] {
	const filePath = path.join(__dirname, "data.json");
	const dataJson = fs.readFileSync(filePath, {
		encoding: "utf-8",
	});

	const data: Producto[] = JSON.parse(dataJson);

	const categories = new Set(data.map((d) => d.Departamento));

	return Array.from(categories).map((c, i) => {
		const date = new Date(Date.now() + i * 1000);
		return {
			id: i + 1,
			name: c,
			createdAt: date,
			updatedAt: date,
		};
	});
}

function generateProducts(categoriesIds: number[]) {
	return Array.from({ length: 200 }).map((_, i) => {
		const costPrice = faker.number.int({
			min: 100,
			max: 100000,
		});

		const stock = faker.number.int({ min: 10, max: 200 });
		const date = new Date(Date.now() + i * 1000);

		return {
			id: i + 1,
			description: faker.commerce.productName(),
			barcode: faker.commerce.isbn(),
			costPrice: costPrice,
			salePrice: Math.floor(costPrice + costPrice * 0.3),
			wholesalePrice: Math.floor(costPrice + costPrice * 0.2),
			categoryId: faker.helpers.arrayElement(categoriesIds),
			stock,
			minStock: Math.floor(stock * 0.01),
			createdAt: date,
			updatedAt: date,
		};
	});
}

function generateProductsFromCSV(
	categoriesIds: { id: number; name: string }[],
): InsertProduct[] {
	const filePath = path.join(__dirname, "data.json");
	const dataJson = fs.readFileSync(filePath, {
		encoding: "utf-8",
	});

	const data: Producto[] = JSON.parse(dataJson);

	return data.map((d, i) => ({
		id: i + 1,
		barcode: d.Codigo.trim(),
		description: d.Descripcion.trim(),
		costPrice: convertNumber(d["Precio Costo"]),
		wholesalePrice: convertNumber(d["Precio Mayoreo"]),
		salePrice: convertNumber(d["Precio Venta"]),
		minStock: d["Inv. Minimo"] === "N/A" ? 0 : d["Inv. Minimo"],
		stock: d.Inventario === "N/A" ? 0 : d.Inventario,
		categoryId: categoriesIds.find((p) => p.name === d.Departamento).id,
		createdAt: new Date(Date.now() + i * 1000),
		updatedAt: new Date(Date.now() + i * 1000),
	}));
}

function generateClients() {
	return Array.from({ length: 20 }).map((_, i) => {
		const date = new Date(Date.now() + i * 1000);

		return {
			fullName: faker.person.fullName(),
			email: faker.internet.email(),
			phone: faker.phone.number(),
			address: faker.location.streetAddress(),
			creditLimit: faker.number.int({ min: 10000000, max: 50000000 }),
			clientCode: faker.database.mongodbObjectId(),
			createdAt: date,
			updatedAt: date,
		};
	});
}

async function seed() {
	const categoriesData = generateCategoriesFromCSV();
	const clientsData = generateClients();
	const productsData = generateProductsFromCSV(
		categoriesData.map((c) => ({
			id: c.id,
			name: c.name,
		})),
	);

	await dbClient.client.delete(payments);
	await dbClient.client.delete(installmentPayments);
	await dbClient.client.delete(installmentPlans);
	await dbClient.client.delete(ticketItems);
	await dbClient.client.delete(tickets);
	await dbClient.client.delete(products);
	await dbClient.client.delete(categories);
	await dbClient.client.delete(clients);

	//Insert Categories
	await dbClient.client.insert(categories).values(categoriesData);
	//Insert Products
	await dbClient.client.insert(products).values(productsData);
	//Insert Clients
	await dbClient.client
		.insert(clients)
		.values(clientsData)
		.returning({ id: clients.id });

	//const ticketsData = generateTickets(productsData, clientIds);

	//await dbClient.client.insert(tickets).values(ticketsData.tickets);
	//await dbClient.client.insert(ticketItems).values(ticketsData.items);
}

seed();
