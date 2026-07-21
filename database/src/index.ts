// Schema is owned by Supabase — see ./supabase-init.sql.
// The Drizzle schema files in ./schema describe the same columns/types and
// are the source of truth for the query builder used by the backend.
// If you change a schema file, mirror the change in supabase-init.sql (and run it
// in the Supabase SQL editor) so the live database stays in sync.

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

function getClient(): postgres.Sql {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL (Supabase) must be set. Add it to your .env file — get the value from Supabase dashboard → Project Settings → Database → Connection string → URI.",
    );
  }
  return postgres(process.env.DATABASE_URL, {
    max: 10,
    idle_timeout: 30,
    connect_timeout: 5,
    prepare: false, // Supabase's pooler doesn't support extended query protocol
  });
}

let _client: postgres.Sql | null = null;

export function getDbClient(): postgres.Sql {
  if (!_client) {
    _client = getClient();
  }
  return _client;
}

export const sql = new Proxy({} as postgres.Sql, {
  get(_target, prop) {
    return (getDbClient() as any)[prop];
  },
});

let _drizzleInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_target, prop) {
    if (!_drizzleInstance) {
      _drizzleInstance = drizzle(getDbClient(), { schema });
    }
    return (_drizzleInstance as any)[prop];
  },
});

export * from "./schema";
