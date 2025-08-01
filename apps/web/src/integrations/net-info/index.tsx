import { createContext, use, useEffect, useState } from "react";
import { PageLoader } from "@/modules/shared/components/page-loader";
import { env } from "@/config/env";

type ThermalInfoType = {
	url: string;
	isActive: boolean;
	version: string | null;
	platform: string | null;
	os: string | null;
	selectedThermal?: string;
};

interface Context {
	isApiOnline: boolean;
	thermalInfo: ThermalInfoType;
}

const NetInfoContext = createContext<Context | null>(null);

export function useNetInfo() {
	const context = use(NetInfoContext);

	if (context === null) {
		throw new Error("useNetInfo must be used within a NetInfoProvider");
	}

	return context;
}

export function NetInfoProvider({ children }: { children: React.ReactNode }) {
	const [isPending, setIsPending] = useState(true);
	const [isApiOnline, setIsApiOnline] = useState(false);
	const [thermalInfo, setThermalInfo] = useState<ThermalInfoType>({
		url: env.VITE_THERMAL_API_URL,
		isActive: false,
		version: null,
		platform: null,
		os: null,
	});

	useEffect(() => {
		fetch(`${env.VITE_API_URL}/health`)
			.then((res) => res.json())
			.then((data) => {
				if (data.status === "ok") {
					setIsApiOnline(true);
				}
			})
			.catch(() => setIsApiOnline(false))
			.finally(() => setIsPending(false));

		fetch(`${env.VITE_THERMAL_API_URL}/printer/version`)
			.then((res) => res.json())
			.then((data) => {
				if (data) {
					setThermalInfo((prev) => ({
						...prev,
						isActive: true,
						version: data.version,
						platform: data.platforma,
						os: data.sistemaOperativo,
					}));
				}
			})
			.catch(() => setIsApiOnline(false));
	}, []);

	if (isPending) {
		return <PageLoader />;
	}

	return (
		<NetInfoContext.Provider
			value={{
				isApiOnline,
				thermalInfo,
			}}
		>
			{children}
		</NetInfoContext.Provider>
	);
}
