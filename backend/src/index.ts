import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config();
dotenv.config({ path: path.resolve(__dirname, "../../../.env"), override: false });

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error("PORT environment variable is required but was not provided.");
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

async function start() {
  const [{ default: app, logger }, { runMigrations }, { startReportScheduler }] = await Promise.all([
    import("./app.js"),
    import("@workspace/db"),
    import("./lib/report-scheduler.js"),
  ]);

  try {
    await runMigrations();
    logger.info("database migrations complete");
  } catch (err) {
    logger.warn({ err: (err as Error).message }, "database not available — running without DB");
  }

  app.listen(port, () => {
    logger.info({ port }, "server listening");
    try {
      startReportScheduler();
    } catch (err) {
      logger.warn({ err: (err as Error).message }, "report scheduler not started");
    }
  });
}

start().catch((err) => {
  console.error("fatal startup error", err);
  process.exit(1);
});
