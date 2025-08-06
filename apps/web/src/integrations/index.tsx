import { BusinessSettingsStoreProvider } from "@/modules/settings/application/stores/business-settings.store";
import { NetInfoProvider } from "./net-info";
import { Router } from "./router";
import { TanstackQueryProvider } from "./tanstack-query";
import { ThemeProvider } from "./theme";
import { TRPCProvider } from "./trpc";
import { ThermalPrinterStoreProvider } from "@/modules/settings/application/stores/thermal-printer.store";
import { LOCAL_STORAGE_KEYS } from "@/modules/shared/lib/constants";

export function Integrations() {
	return (
		<BusinessSettingsStoreProvider>
			<ThermalPrinterStoreProvider>
				<NetInfoProvider>
					<ThemeProvider storageKey={LOCAL_STORAGE_KEYS.THEME}>
						<TanstackQueryProvider>
							<TRPCProvider>
								<Router />
							</TRPCProvider>
						</TanstackQueryProvider>
					</ThemeProvider>
				</NetInfoProvider>
			</ThermalPrinterStoreProvider>
		</BusinessSettingsStoreProvider>
	);
}
