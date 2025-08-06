import { Suspense } from "react";
import { Printer, Terminal } from "lucide-react";
import {
	Alert,
	AlertDescription,
	AlertTitle,
} from "@/modules/shared/components/ui/alert";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/modules/shared/components/ui/card";
import { ThermalForm } from "../components/thermal-form";
import { useThermalPrinterStore } from "@/modules/settings/application/stores/thermal-printer.store";

export function ThermalInfoSectionSuspense() {
	const { thermalInfo, thermalNames, url, saveData } = useThermalPrinterStore();
	const isThermalActive = thermalInfo?.isActive;

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Printer className="h-5 w-5" />
					Impresoras Térmicas
				</CardTitle>
				<CardDescription>
					Configura las impresoras para tickets y recibos
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{!isThermalActive && (
					<Alert variant="destructive">
						<Terminal />
						<AlertTitle>Error al conectar con la impresora</AlertTitle>
						<AlertDescription>
							No se pudo conectar con la impresora, comprueba que esté conectada
							y que no haya un firewall bloqueando el puerto.
						</AlertDescription>
					</Alert>
				)}
				{isThermalActive && (
					<ThermalForm.Root
						className="space-y-6"
						printers={thermalNames}
						thermalInfo={{
							url,
							...thermalInfo,
						}}
						onSave={saveData}
					>
						<fieldset className="flex gap-x-2">
							<ThermalForm.ThermalName />
							<ThermalForm.ThermalUrl />
						</fieldset>
						<fieldset className="flex gap-x-2">
							<ThermalForm.Platform />
							<ThermalForm.Version />
						</fieldset>
						<ThermalForm.Submit className="flex-1 w-full" />
					</ThermalForm.Root>
				)}
			</CardContent>
		</Card>
	);
}

export function ThermalInfoSection() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<ThermalInfoSectionSuspense />
		</Suspense>
	);
}
