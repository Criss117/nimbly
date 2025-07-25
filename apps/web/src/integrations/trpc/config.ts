import { createTRPCContext } from "@trpc/tanstack-react-query";
import type { AppRouter } from "@nimbly/trpc";

export const { TRPCProvider, useTRPC, useTRPCClient } =
	createTRPCContext<AppRouter>();
