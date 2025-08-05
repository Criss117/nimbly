import { ThermalQuery } from ".";

type Product = {
	description: string;
	salePrice: number;
	quantity: number;
};

export class Ticket {
	private thermalQuery: ThermalQuery;

	constructor() {
		this.thermalQuery = ThermalQuery.init("POS-80C")
			.cut()
			.aling("center")
			.emphasized()
			.fontSize({ width: 2, height: 2 })
			.writeText("Tienda Andres")
			.emphasized(false)
			.fontSize({ width: 1, height: 1 })
			.writeText("NIT: 1061737674")
			.writeText("RÉGIMEN SIMPLIFICADO")
			.writeText("BARRIO EL PROGRESO CRA 3#10-11")
			.writeText("MERCADERES CAUCA")
			.writeText("")
			.writeText("")
			.writeText(ThermalQuery.completeOneLine("CANT. DESCRIPCION", "IMPORTE"))
			.separator();
	}

	public addProducts(products: Product[]) {
		for (const product of products) {
			this.thermalQuery = this.thermalQuery.writeText(
				ThermalQuery.formatEntry(
					product.quantity,
					product.description,
					product.salePrice * product.quantity,
				),
			);
		}

		const nItems = products.reduce((acc, product) => acc + product.quantity, 0);
		const total = products.reduce(
			(acc, product) => acc + product.salePrice * product.quantity,
			0,
		);

		this.thermalQuery = this.thermalQuery
			.writeText("")
			.aling("center")
			.writeText(`NO. DE ARTICULOS: ${nItems}`)
			.aling("right")
			.fontSize({ width: 2, height: 2 })
			.writeText(`TOTAL: $${total}`)
			.writeText("")
			.cut();

		return this;
	}

	public payWidthSection(totalPay: number, payWith: number) {
		this.thermalQuery = this.thermalQuery
			.aling("right")
			.fontSize({ width: 2, height: 2 })
			.writeText(`PAGO CON: $${payWith}`)
			.writeText(`SU CAMBIO: $${payWith - totalPay}`);
	}

	public get payload() {
		return this.thermalQuery.payload;
	}
}
