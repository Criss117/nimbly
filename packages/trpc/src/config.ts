import "dotenv/config";

import DBClient from "@nimbly/db";
import { initTRPC } from "@trpc/server";
import superjson from "superjson";

const t = initTRPC.create({
	transformer: superjson,
});
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure;

export const dbClient = new DBClient(process.env.TURSO_URL);
