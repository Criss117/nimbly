import { appRouter } from "@nimbly/trpc";
import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import morgan from "morgan";
import express from "express";

const app = express();
const port = 8787;

// const allowedOrigins: string[] = [
// 	"http://localhost:5173",
// 	"nimbly://",
// 	"https://t3j4nl8l-5173.use.devtunnels.ms",
// 	env.CLIENT_URL as string,
// ];

app.use(morgan("dev"));

app.use(
	cors({
		origin: "*",
		allowedHeaders: [
			"Content-Type",
			"Authorization",
			"X-Requested-With",
			"Accept",
			"Origin",
		],
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		maxAge: 600,
		credentials: true,
	}),
);

app.get("/health", async (_, res) => {
	res.status(200).json({ status: "ok" });
});

app.use(
	"/api",
	trpcExpress.createExpressMiddleware({
		router: appRouter,
	}),
);

app.listen(port, () => {
	console.log(`API listening on port ${port}`);
});
