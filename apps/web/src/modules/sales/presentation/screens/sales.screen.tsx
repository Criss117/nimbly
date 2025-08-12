import { SalesFooterSection } from "../sections/sales-footer.section";
import { SalesHeaderSection } from "../sections/sales-header.section";
import { SalesSection } from "../sections/sales.section";
import { TicketsListSection } from "../sections/tickets-list.section";

export function SalesScreen() {
	return (
		<div className="flex flex-col min-h-screen">
			<SalesHeaderSection />
			<section className="mt-20 mb-36 mx-20">
				<SalesSection />
				<TicketsListSection />
			</section>
			<SalesFooterSection />
		</div>
	);
}
