// scripts/test-supabase.mjs
// One-shot connection test. Run: node scripts/test-supabase.mjs
// (no extra deps — uses the workspace-installed `postgres` via require.resolve)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load repo-root .env (DATABASE_URL etc.)
const envPath = path.resolve(__dirname, "..", ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2];
  }
}

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("❌ DATABASE_URL is not set in .env");
  process.exit(1);
}

const masked = url.replace(/:[^:@/]+@/, ":***@");
console.log("→ Connecting to Supabase…");
console.log("  URL:", masked);

// Resolve `postgres` from the workspace's hoisted node_modules.
// On Windows we need pathToFileURL to feed dynamic import().
function loadPostgres() {
  const candidates = [
    path.resolve(__dirname, "..", "node_modules", "postgres", "src", "index.js"),
    path.resolve(__dirname, "..", "database", "node_modules", "postgres", "src", "index.js"),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return import(pathToFileURL(p).href);
  }
  throw new Error("Could not find `postgres` in node_modules. Run `pnpm install` first.");
}

const { default: postgres } = await loadPostgres();

const sql = postgres(url, { connect_timeout: 10, prepare: false });
const t0 = Date.now();

try {
  const [{ now, version }] = await sql`select now() as now, version() as version`;
  const ms = Date.now() - t0;
  console.log(`✅ Connected in ${ms}ms`);
  console.log("  Server time:", new Date(now).toISOString());
  console.log("  Postgres:   ", version.split(" ").slice(0, 2).join(" "));

  const tables = await sql`
    select tablename from pg_tables
    where schemaname = 'public'
    order by tablename
  `;
  console.log(`\n📋 public schema tables (${tables.length}):`);
  for (const { tablename } of tables) console.log("   -", tablename);

  const want = ["users", "alert_settings"];
  const have = new Set(tables.map((t) => t.tablename));
  const missing = want.filter((t) => !have.has(t));
  if (missing.length) {
    console.log(`\n⚠️  Missing: ${missing.join(", ")}`);
    console.log("   → Run database/supabase-init.sql in Supabase SQL editor to create them.");
  } else {
    console.log("\n✅ All required tables present");
    const [{ count: userCount }] = await sql`select count(*)::int as count from users`;
    console.log(`   users row count: ${userCount}`);
  }

  await sql.end({ timeout: 2 });
  process.exit(0);
} catch (err) {
  console.error("\n❌ Connection failed:", err.message || err);
  if (err.code === "ENOTFOUND") {
    console.error("   → Host not found. Check the URL.");
  } else if (err.code === "ETIMEDOUT" || err.code === "EHOSTUNREACH") {
    console.error("   → Network unreachable. The Supabase direct connection (port 5432) only works from whitelisted IPs.");
    console.error("     Use the Transaction pooler (port 6543) for broader network access.");
  } else if (/password authentication failed/i.test(err.message || "")) {
    console.error("   → Wrong password. Re-copy the connection string from Supabase dashboard.");
  } else if (/getaddrinfo/i.test(err.message || "")) {
    console.error("   → DNS resolution failed. Check the URL host.");
  }
  process.exit(1);
}
