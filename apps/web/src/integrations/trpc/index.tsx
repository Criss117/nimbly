import { useState } from "react";
import superjson from "superjson";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { TRPCProvider as TProvider } from "./config";
import type { AppRouter } from "@nimbly/trpc";
import { getQueryClient } from "../tanstack-query/config";
import { env } from "@/config/env";

export function TRPCProvider({ children }: { children: React.ReactNode }) {
	const queryClient = getQueryClient();
	const [trpcClient] = useState(() =>
		createTRPCClient<AppRouter>({
			links: [
				httpBatchLink({
					transformer: superjson,
					url: `${env.VITE_API_URL}/api/trpc`,
				}),
			],
		}),
	);
	return (
		<TProvider trpcClient={trpcClient} queryClient={queryClient}>
			{children}
		</TProvider>
	);
}
