import { createContext, use, useEffect, useState } from "react";
import { PageLoader } from "@/modules/shared/components/page-loader";
import type { ThermalInfoDto } from "../dtos/thermal-info.dto";
import { LOCAL_STORAGE_KEYS } from "@/modules/shared/lib/constants";

type ThermalInfo = Omit<ThermalInfoDto, "url">;

interface Context {
	url: string;
	thermalInfo: ThermalInfo | null;
	thermalNames: string[];
	saveData: (info: ThermalInfoDto) => void;
}

type ThermalQueryResponse = {
	plataforma: string;
	sistemaOperativo: string;
	version: string;
};

const ThermalPrinterStoreContext = createContext<Context | null>(null);

export function useThermalPrinterStore() {
	const context = use(ThermalPrinterStoreContext);

	if (context === null) {
		throw new Error(
			"useThermalPrinterStore must be used within a ThermalPrinterStoreProvider",
		);
	}

	return context;
}

async function getThermalNames(ipUrl: string) {
	return fetch(`${ipUrl}/printer/version`)
		.then((res) => res.json())
		.then((data) => {
			if (data) {
				return data as ThermalQueryResponse;
			}

			return null;
		});
}

const exampleThermalInfo: ThermalInfo = {
	isActive: true,
	platform: "Windows",
	selectedThermalName: "",
	version: "1.0.0",
	os: "OS",
};

const exampleThermalNames = ["ThermalName", "POS-80C"];

export function ThermalPrinterStoreProvider({
	children,
}: { children: React.ReactNode }) {
	const [url, setUrl] = useState("http://192.168.101.11:8788");
	const [thermalNames, setThermalNames] =
		useState<string[]>(exampleThermalNames);
	const [thermalInfo, setThermalInfo] = useState<ThermalInfo | null>(
		exampleThermalInfo,
	);
	const [isPending, setIsPending] = useState(false);

	// useEffect(() => {
	// 	if (!url) {
	// 		setIsPending(false);
	// 		return;
	// 	}

	// 	getThermalNames(url)
	// 		.then((data) => {
	// 			if (data) {
	// 				setThermalInfo({
	// 					isActive: true,
	// 					platform: data.plataforma,
	// 					selectedThermalName: data.sistemaOperativo,
	// 					version: data.version,
	// 					os: data.sistemaOperativo,
	// 				});
	// 			}
	// 			setThermalInfo(null);
	// 		})
	// 		.finally(() => setIsPending(false));
	// }, [url]);

	const saveData = ({ url, ...data }: ThermalInfoDto) => {
		setThermalInfo(data);
		setUrl(url);
		localStorage.setItem(
			LOCAL_STORAGE_KEYS.THERMAL_INFO,
			JSON.stringify({ url, ...data }),
		);
	};

	if (isPending) {
		return <PageLoader />;
	}

	return (
		<ThermalPrinterStoreContext.Provider
			value={{
				url,
				thermalInfo,
				thermalNames,
				saveData,
			}}
		>
			{children}
		</ThermalPrinterStoreContext.Provider>
	);
}
