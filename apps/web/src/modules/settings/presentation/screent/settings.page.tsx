import { useNetInfo } from "@/integrations/net-info";
import { SiteHeader } from "@/modules/shared/components/app-sidebar";
import { Button } from "@/modules/shared/components/ui/button";
import { ThermalQuery } from "@/modules/shared/lib/thermal-api";

export function SettingsPage() {
	const { thermalInfo } = useNetInfo();

	const thermalQuery = ThermalQuery.init("POS-80C")
		.cut()
		.aling("center")
		.emphasized()
		.fontSize({ width: 2, height: 2 })
		.writeText("Tienda Andres")
		.emphasized(false)
		.fontSize({ width: 1, height: 1 })
		.writeText("NIT: 1061737674")
		.writeText("RÉGIMEN SIMPLIFICADO")
		.writeText("BARRIO EL PROGRESO CRA 3#10-11")
		.writeText("MERCADERES CAUCA")
		.writeText("")
		.writeText("")
		.writeText(ThermalQuery.completeOneLine("CANT. DESCRIPCION", "IMPORTE"))
		.separator()
		.writeText(
			ThermalQuery.formatEntry(
				5,
				"una descripcion muy largar para ver si",
				100000,
			),
		)
		.writeText("")
		.aling("center")
		.writeText("NO. DE ARTICULOS: 1")
		.emphasized()
		.fontSize({ width: 2, height: 2 })
		.writeText("TOTAL: $100.000")
		.writeText("* VENTA A CREDITO *")
		.fontSize({ width: 1, height: 1 })
		.writeText("FIRMA DEL CLIENTE")
		.pulse()
		.cut();

	const print = () => {
		fetch(`${thermalInfo.url}/printer/imprimir`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(thermalQuery.payload),
		}).then((res) => res.json());
	};

	return (
		<div>
			<SiteHeader label="Configuraciones" />
			<Button onClick={print}>Print</Button>
			<pre>
				<code>{JSON.stringify(thermalQuery.payload, null, 2)}</code>
			</pre>
		</div>
	);
}
