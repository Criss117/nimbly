import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getQueryClient } from "./config";

export function TanstackQueryProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const queryclient = getQueryClient();

	return (
		<QueryClientProvider client={queryclient}>
			{children}
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}
