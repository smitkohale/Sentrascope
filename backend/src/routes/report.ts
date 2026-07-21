import { Router, type IRouter } from "express";
import { requireAuth, type AuthRequest } from "../lib/auth-middleware.js";
import { runReports } from "../lib/report-scheduler.js";
import { collectReport, type PeriodType } from "../lib/report-data.js";
import { buildReportEmail } from "../lib/report-email.js";
import { sendEmail } from "../lib/email.js";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger.js";

const router: IRouter = Router();

const VALID_PERIODS: PeriodType[] = ["daily", "weekly", "monthly"];

router.post("/report/send-now", requireAuth, async (req: AuthRequest, res) => {
  const period = (req.body as { period?: string }).period as PeriodType | undefined;
  if (!period || !VALID_PERIODS.includes(period)) {
    res.status(400).json({ error: "invalid_period", message: "period must be 'daily', 'weekly', or 'monthly'." });
    return;
  }

  const userId = req.user!.userId;
  const [user] = await db
    .select({ name: usersTable.name, email: usersTable.email })
    .from(usersTable)
    .where(eq(usersTable.id, userId))
    .limit(1);

  if (!user) {
    res.status(404).json({ error: "not_found", message: "User not found." });
    return;
  }

  try {
    const report = await collectReport(period);
    const { html, text, subject } = buildReportEmail(report, user.name);
    await sendEmail({ to: user.email, subject, html, text });
    res.json({ message: `${period} report sent to ${user.email}.`, subject });
  } catch (err) {
    logger.error({ err, period, email: user.email }, "report/send-now failed");
    res.status(500).json({ error: "send_failed", message: "Failed to generate or send the report." });
  }
});

router.post("/report/run-all/:period", requireAuth, async (req: AuthRequest, res) => {
  const period = req.params.period as PeriodType;
  if (!VALID_PERIODS.includes(period)) {
    res.status(400).json({ error: "invalid_period", message: "period must be 'daily', 'weekly', or 'monthly'." });
    return;
  }
  res.json({ message: `Triggering ${period} report batch for all subscribers.` });
  runReports(period).catch(err => logger.error({ err, period }, "report/run-all failed"));
});

export default router;
