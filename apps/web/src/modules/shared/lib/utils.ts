import type { ClassValue } from "class-variance-authority/types";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
	return value.toLocaleString("es-ES", {
		style: "currency",
		currency: "COP",
	});
}
