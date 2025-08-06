import { env } from "@/config/env";
import { createContext, use, useEffect, useState } from "react";
import { PageLoader } from "@/modules/shared/components/page-loader";

interface Context {
	isApiOnline: boolean;
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
	}, []);

	if (isPending) {
		return <PageLoader />;
	}

	return (
		<NetInfoContext.Provider
			value={{
				isApiOnline,
			}}
		>
			{children}
		</NetInfoContext.Provider>
	);
}
