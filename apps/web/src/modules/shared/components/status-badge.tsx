import type { TicketStatus } from "@/modules/sales/application/models/schemas";
import { Badge } from "./ui/badge";
import { cn } from "../lib/utils";
import { ticketStatusBadge } from "../lib/badge";

interface Props {
	value: TicketStatus;
	className?: string;
}

export function StatusBadge({ value, className }: Props) {
	const status = ticketStatusBadge(value);

	return (
		<Badge
			className={cn(
				"w-1/2 rounded-full flex justify-start mx-auto",
				status.class,
				className,
			)}
		>
			<status.Icon />
			{status.label}
		</Badge>
	);
}
