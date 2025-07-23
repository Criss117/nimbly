import { drizzle } from "drizzle-orm/libsql";
import type { ResultSet } from "@libsql/client";
import type { ExtractTablesWithRelations } from "drizzle-orm";
import type { SQLiteTransaction } from "drizzle-orm/sqlite-core";

import * as tables from "./tables";
import * as relations from "./relations";
import * as shared from "./shared";

export type TX = SQLiteTransaction<
	"async",
	ResultSet,
	Record<string, never>,
	ExtractTablesWithRelations<Record<string, never>>
>;

export function generateDBClient({
	url,
	authToken,
}: {
	url: string;
	authToken?: string;
}) {
	return drizzle({
		connection: {
			url,
			authToken,
		},
	});
}

export default class DBClient {
	private db: ReturnType<typeof generateDBClient>;

	constructor(url: string, authToken?: string) {
		const db = generateDBClient({ url, authToken });

		if (!db) {
			throw new Error();
		}

		this.db = db;
	}

	public get client() {
		return this.db;
	}

	public async transaction<T>(callback: (tx: TX) => Promise<T>): Promise<T> {
		return this.db.transaction((tx) => callback(tx));
	}
}

export const schemas = {
	tables,
	relations,
	shared,
};
