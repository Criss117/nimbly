// Import the generated route tree
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen";
import { useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "../trpc/config";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

export function Router() {
	const trpc = useTRPC();
	const queryClient = useQueryClient();

	return (
		<RouterProvider
			router={router}
			context={{
				queryClient,
				trpc,
			}}
		/>
	);
}
