import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

function getPool(): pg.Pool {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL must be set. Add it to your .env file or Replit Secrets.",
    );
  }
  return new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  });
}

let _pool: pg.Pool | null = null;

export function getDbPool(): pg.Pool {
  if (!_pool) {
    _pool = getPool();
  }
  return _pool;
}

export const pool = new Proxy({} as pg.Pool, {
  get(_target, prop) {
    return (getDbPool() as any)[prop];
  },
});

let _drizzleInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_target, prop) {
    if (!_drizzleInstance) {
      _drizzleInstance = drizzle(getDbPool(), { schema });
    }
    return (_drizzleInstance as any)[prop];
  },
});

export async function runMigrations(): Promise<void> {
  const client = await getDbPool().connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id                  SERIAL PRIMARY KEY,
        name                TEXT NOT NULL,
        email               TEXT NOT NULL UNIQUE,
        password_hash       TEXT NOT NULL,
        email_verified      BOOLEAN NOT NULL DEFAULT false,
        verify_token        TEXT,
        verify_token_expiry TIMESTAMP,
        reset_token         TEXT,
        reset_token_expiry  TIMESTAMP,
        created_at          TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT false`);
    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS verify_token TEXT`);
    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS verify_token_expiry TIMESTAMP`);
    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token TEXT`);
    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token_expiry TIMESTAMP`);

    await client.query(`
      CREATE TABLE IF NOT EXISTS alert_settings (
        id         SERIAL PRIMARY KEY,
        user_id    INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        daily      BOOLEAN NOT NULL DEFAULT true,
        weekly     BOOLEAN NOT NULL DEFAULT false,
        monthly    BOOLEAN NOT NULL DEFAULT false,
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    await client.query(`CREATE INDEX IF NOT EXISTS idx_users_verify_token ON users(verify_token) WHERE verify_token IS NOT NULL`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_users_reset_token ON users(reset_token) WHERE reset_token IS NOT NULL`);
  } finally {
    client.release();
  }
}

export * from "./schema";
