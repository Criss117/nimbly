import { QueryClient } from "@tanstack/react-query";

function makeQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				// With SSR, we usually want to set some default staleTime
				// above 0 to avoid refetching immediately on the client
				staleTime: 1000 * 60 * 60, // 1 hour
				retry: 0,
			},
		},
	});
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
	if (typeof window === "undefined") {
		// Server: always make a new query client
		return makeQueryClient();
	}
	if (!browserQueryClient) browserQueryClient = makeQueryClient();
	return browserQueryClient;
}
