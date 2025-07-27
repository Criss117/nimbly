import type { InstallmentModality } from "@nimbly/core/clients";

export function translateModality(modality: InstallmentModality) {
	switch (modality) {
		case "weekly":
			return "Semanal";
		case "monthly":
			return "Mensual";
		case "biweekly":
			return "Bimensual";
	}
}
