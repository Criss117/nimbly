import type {
	TicketCreditType,
	TicketStatus,
} from "@/modules/sales/application/models/schemas";
import type { VariantProps } from "class-variance-authority";
import { CheckCircle, Clock, type LucideProps } from "lucide-react";
import type { badgeVariants } from "../components/ui/badge";

export function ticketStatusBadge(state: TicketStatus): {
	label: string;
	class: string;
	Icon: React.ForwardRefExoticComponent<
		Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
	>;
} {
	switch (state) {
		case "unpaid":
			return {
				label: "Pendiente",
				class: "bg-yellow-200 text-yellow-800 hover:bg-yellow-100",
				Icon: Clock,
			};
		case "paid":
			return {
				label: "Pagado",
				class: "bg-green-300 text-green-800 hover:bg-green-100",
				Icon: CheckCircle,
			};
		case "partial":
			return {
				label: "Parcial",
				class: "bg-green-100 text-green-800 hover:bg-green-100",
				Icon: CheckCircle,
			};
		default:
			return {
				label: "Pendiente",
				class: "destructive",
				Icon: Clock,
			};
	}
}

export const creditTypeBadge = (
	creditType: TicketCreditType,
): {
	label: string;
	variant: VariantProps<typeof badgeVariants>["variant"];
} => {
	switch (creditType) {
		case "global":
			return { label: "Crédito global", variant: "default" };
		case "individual":
			return { label: "Cuotas", variant: "outline" };
		default:
			return {
				label: "Crédito global",
				variant: "default",
			};
	}
};
