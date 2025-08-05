import { createContext, use, useEffect, useState } from "react";
import {
	businessInfoDto,
	type BusinessInfoDto,
} from "../dtos/business-info.dto";

interface BussinessSettingsStore {
	businessInfo: BusinessInfoDto | null;
	setBusinessInfo: (businessInfo: BusinessInfoDto) => void;
}

const BusinessSettingsStore = createContext<BussinessSettingsStore | null>(
	null,
);

export function useBusinessSettingsStore() {
	const context = use(BusinessSettingsStore);

	if (context === null) {
		throw new Error(
			"useBusinessSettingsStore must be used within a BusinessSettingsStoreProvider",
		);
	}

	return context;
}

export function BusinessSettingsStoreProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [values, setValues] = useState<BusinessInfoDto | null>(null);

	const setBusinessInfo = (businessInfo: BusinessInfoDto) => {
		setValues(businessInfo);
		localStorage.setItem("nimbly-business-info", JSON.stringify(businessInfo));
	};

	useEffect(() => {
		const infoSaved = localStorage.getItem("nimbly-business-info");

		if (!infoSaved) return;

		const { success, data } = businessInfoDto.safeParse(JSON.parse(infoSaved));

		if (success && data) {
			setValues(data);
		}
	}, []);

	return (
		<BusinessSettingsStore.Provider
			value={{
				businessInfo: values,
				setBusinessInfo,
			}}
		>
			{children}
		</BusinessSettingsStore.Provider>
	);
}
