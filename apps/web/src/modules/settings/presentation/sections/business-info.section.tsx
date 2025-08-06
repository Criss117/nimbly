import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/modules/shared/components/ui/card";
import { useBusinessSettingsStore } from "../../application/stores/business-settings.store";
import { BusinessForm } from "../components/business-form";
import { Store } from "lucide-react";

export function BusinessInfoSection() {
	const { businessInfo, setBusinessInfo } = useBusinessSettingsStore();

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Store className="h-5 w-5" />
					Información de la Tienda
				</CardTitle>
				<CardDescription>
					Configura los datos que aparecerán en los recibos
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<BusinessForm.Root
					values={businessInfo ?? undefined}
					onSave={setBusinessInfo}
				>
					<fieldset className="space-y-5">
						<fieldset className="flex gap-x-2">
							<BusinessForm.Name />
							<BusinessForm.Address />
						</fieldset>
						<BusinessForm.NIT />
						<BusinessForm.Submit className="w-full" />
					</fieldset>
				</BusinessForm.Root>
			</CardContent>
		</Card>
	);
}
