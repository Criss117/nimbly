import { useState } from "react";
import superjson from "superjson";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { TRPCProvider as TProvider } from "./config";
import type { AppRouter } from "@nimbly/trpc";
import { getQueryClient } from "../tanstack-query/config";

export function TRPCProvider({ children }: { children: React.ReactNode }) {
	const queryClient = getQueryClient();
	const [trpcClient] = useState(() =>
		createTRPCClient<AppRouter>({
			links: [
				httpBatchLink({
					transformer: superjson,
					url: `http://localhost:8787/api/trpc`,
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
