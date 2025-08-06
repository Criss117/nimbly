import { Printer, Store } from "lucide-react";
import { SiteHeader } from "@/modules/shared/components/app-sidebar";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/modules/shared/components/ui/tabs";
import { BusinessInfoSection } from "../sections/business-info.section";
import { ThermalInfoSection } from "../sections/thermal-info.section";

const tabs = [
	{
		value: "business",
		label: "Información de la empresa",
		Icon: () => <Store />,
		View: () => <BusinessInfoSection />,
	},
	{
		value: "thermal-printers",
		label: "Impresoras",
		Icon: () => <Printer />,
		View: () => <ThermalInfoSection />,
	},
] as const;

export function SettingsScreen() {
	return (
		<>
			<SiteHeader label="Configuraciones" />
			<div className="flex flex-col items-center justify-center space-y-5 mt-5 mx-10">
				<Tabs
					defaultValue="business"
					className="min-w-4xl max-w-6xl mx-auto space-y-6"
				>
					<TabsList className="w-full">
						{tabs.map((t) => (
							<TabsTrigger key={t.value} value={t.value} className="flex-1">
								<t.Icon />
								{t.label}
							</TabsTrigger>
						))}
					</TabsList>
					{tabs.map((t) => (
						<TabsContent key={t.value} value={t.value}>
							<t.View />
						</TabsContent>
					))}
				</Tabs>
			</div>
		</>
	);
}
