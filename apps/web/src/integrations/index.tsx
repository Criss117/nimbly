import { BusinessSettingsStoreProvider } from "@/modules/settings/application/stores/business-settings.store";
import { NetInfoProvider } from "./net-info";
import { Router } from "./router";
import { TanstackQueryProvider } from "./tanstack-query";
import { ThemeProvider } from "./theme";
import { TRPCProvider } from "./trpc";

export function Integrations() {
	return (
		<BusinessSettingsStoreProvider>
			<NetInfoProvider>
				<ThemeProvider>
					<TanstackQueryProvider>
						<TRPCProvider>
							<Router />
						</TRPCProvider>
					</TanstackQueryProvider>
				</ThemeProvider>
			</NetInfoProvider>
		</BusinessSettingsStoreProvider>
	);
}
