import { ArrowLeftCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { ClientDetail } from "@nimbly/core/clients";
import { SiteHeader } from "@/modules/shared/components/app-sidebar";
import { Button } from "@/modules/shared/components/ui/button";
import { ClientHeaderSection } from "../sections/client-header.section";
import { ClientDataTable } from "../components/client-data-table";

interface Props {
	client: ClientDetail;
}

export function ClientScreen({ client }: Props) {
	return (
		<div>
			<SiteHeader label={client.fullName} />
			<div className="m-10 space-y-5">
				<Button variant="link" size="lg" asChild>
					<Link to="/dashboard/clients">
						<ArrowLeftCircle />
						Lista de clientes
					</Link>
				</Button>
				<ClientHeaderSection client={client} />
				<ClientDataTable clientId={client.id} />
			</div>
		</div>
	);
}
