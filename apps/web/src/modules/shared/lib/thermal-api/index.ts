export const operations = {
	init: "Iniciar",
	writeText: "EscribirTexto",
	cut: "Corte",
	aling: "EstablecerAlineacion",
	fontSize: "EstablecerTamañoFuente",
	underline: "EstablecerSubrayado",
	emphasized: "EstablecerEnfatizado",
	pulse: "Pulso",
} as const;

export const Position = {
	left: 0,
	center: 1,
	right: 2,
} as const;

export type PayloadOperation = {
	nombre: (typeof operations)[keyof typeof operations];
	argumentos: (string | number | boolean)[];
};

export type Payload = {
	serial: string;
	nombreImpresora: string;
	operaciones: PayloadOperation[];
};

export type FontSize = {
	width: number;
	height: number;
};

export class ThermalQuery {
	private values: Payload = {
		serial: "",
		nombreImpresora: "",
		operaciones: [],
	};

	constructor(payload: Payload) {
		this.values = payload;
	}

	public printerName(name: string) {
		return new ThermalQuery({ ...this.values, nombreImpresora: name });
	}

	static init(thermalName: string) {
		return new ThermalQuery({
			serial: "",
			nombreImpresora: thermalName,
			operaciones: [{ nombre: operations.init, argumentos: [] }],
		});
	}

	public aling(position: keyof typeof Position) {
		const pos = Position[position];

		return new ThermalQuery({
			...this.values,
			operaciones: [
				...this.values.operaciones,
				{ nombre: operations.aling, argumentos: [pos] },
			],
		});
	}

	public writeText(text: string) {
		return new ThermalQuery({
			...this.values,
			operaciones: [
				...this.values.operaciones,
				{ nombre: operations.writeText, argumentos: [text.concat("\n")] },
			],
		});
	}

	public fontSize(meta: FontSize) {
		if (
			meta.width < 0 ||
			meta.height < 0 ||
			meta.width > 8 ||
			meta.height > 8
		) {
			throw new Error("Invalid font size");
		}

		return new ThermalQuery({
			...this.values,
			operaciones: [
				...this.values.operaciones,
				{ nombre: operations.fontSize, argumentos: [meta.width, meta.height] },
			],
		});
	}

	public cut(lines = 1) {
		return new ThermalQuery({
			...this.values,
			operaciones: [
				...this.values.operaciones,
				{ nombre: operations.cut, argumentos: [lines] },
			],
		});
	}

	public underline(active = true) {
		return new ThermalQuery({
			...this.values,
			operaciones: [
				...this.values.operaciones,
				{ nombre: operations.underline, argumentos: [active] },
			],
		});
	}

	public emphasized(active = true) {
		return new ThermalQuery({
			...this.values,
			operaciones: [
				...this.values.operaciones,
				{ nombre: operations.emphasized, argumentos: [active] },
			],
		});
	}

	public separator() {
		return new ThermalQuery({
			...this.values,
			operaciones: [...this.values.operaciones],
		}).writeText("=".repeat(48));
	}

	public pulse() {
		return new ThermalQuery({
			...this.values,
			operaciones: [
				...this.values.operaciones,
				{ nombre: operations.pulse, argumentos: [48, 60, 120] },
			],
		});
	}

	static completeOneLine(...text: string[]) {
		if (!text || text.length === 0) {
			return "";
		}

		const stringUnido: string = text.join(" ");

		if (stringUnido.length >= 48) {
			return stringUnido;
		}

		const espaciosARellenar: number = 48 - stringUnido.length;

		if (text.length > 1) {
			// Distribuir los puntos equitativamente si hay más de una palabra
			const numHoles: number = text.length - 1;
			const spacesPerHoles: number = Math.floor(espaciosARellenar / numHoles);
			let extraSpaces: number = espaciosARellenar % numHoles;

			const partes: string[] = [];
			for (let i = 0; i < text.length; i++) {
				partes.push(text[i]);
				if (i < numHoles) {
					// Añadir puntos y un punto extra si corresponde
					partes.push(" ".repeat(spacesPerHoles));
					if (extraSpaces > 0) {
						partes.push(".");
						extraSpaces--;
					}
				}
			}
			return partes.join("");
		}
		return stringUnido + ".".repeat(espaciosARellenar);
	}

	static formatEntry(quantity: number, description: string, total: number) {
		const quantityString = String(quantity).padEnd(7, " "); // Ensure 6 characters, padded with spaces
		const totalString = String(total); // Total can be variable length

		// Calculate available space for description
		// Quantity (5 chars) + Total (variable) + Description
		const availableDescriptionLength =
			48 - quantityString.length - (totalString.length + 2); // +1 for the space before the total

		let formattedDescription: string;
		if (description.length > availableDescriptionLength) {
			formattedDescription = description.substring(
				0,
				availableDescriptionLength - 1,
			);
		} else {
			// Pad the description with spaces if it's shorter than the available space
			formattedDescription = description.padEnd(
				availableDescriptionLength,
				" ",
			);
		}

		return `${quantityString}${formattedDescription.concat(" ")}${"$".concat(totalString)}`;
	}

	public get payload() {
		return this.values;
	}
}
