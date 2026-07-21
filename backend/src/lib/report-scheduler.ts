import cron from "node-cron";
import { db } from "@workspace/db";
import { alertSettingsTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { collectReport, type PeriodType } from "./report-data.js";
import { buildReportEmail } from "./report-email.js";
import { sendEmail } from "./email.js";
import { logger } from "./logger.js";

/* ─── Helpers ─────────────────────────────────────────────────── */

function getISTDate(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
}

function isSunday(d: Date): boolean {
  return d.getDay() === 0;
}

function isLastDayOfMonth(d: Date): boolean {
  const tomorrow = new Date(d);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.getDate() === 1;
}

/**
 * Among the periods that are both *due today* and *enabled by the user*,
 * return the highest-priority one: monthly > weekly > daily.
 * Returns null if nothing applies.
 */
function pickPeriod(
  settings: { daily: boolean; weekly: boolean; monthly: boolean },
  duePeriods: PeriodType[],
): PeriodType | null {
  if (duePeriods.includes("monthly") && settings.monthly) return "monthly";
  if (duePeriods.includes("weekly")  && settings.weekly)  return "weekly";
  if (duePeriods.includes("daily")   && settings.daily)   return "daily";
  return null;
}

/* ─── Manual trigger (used by /report/run-all route) ─────────── */

export async function runReports(period: PeriodType): Promise<void> {
  logger.info({ period }, "report-scheduler: manual trigger");

  const col =
    period === "daily"   ? alertSettingsTable.daily   :
    period === "weekly"  ? alertSettingsTable.weekly  :
                           alertSettingsTable.monthly;

  const settings = await db
    .select({ userId: alertSettingsTable.userId })
    .from(alertSettingsTable)
    .where(eq(col, true));

  const userIds = settings.map(s => s.userId);
  if (userIds.length === 0) {
    logger.info({ period }, "report-scheduler: no subscribers");
    return;
  }

  const users = await db
    .select({ id: usersTable.id, name: usersTable.name, email: usersTable.email })
    .from(usersTable)
    .where(eq(usersTable.emailVerified, true));

  const eligibleUsers = users.filter(u => userIds.includes(u.id));
  if (eligibleUsers.length === 0) {
    logger.info({ period }, "report-scheduler: no verified subscribers");
    return;
  }

  const report = await collectReport(period);
  logger.info({ period, recipients: eligibleUsers.length }, "report-scheduler: sending reports");

  let sent = 0, failed = 0;
  for (const user of eligibleUsers) {
    const { html, text, subject } = buildReportEmail(report, user.name);
    try {
      await sendEmail({ to: user.email, subject, html, text });
      sent++;
    } catch (err) {
      logger.error({ err, email: user.email, period }, "report-scheduler: failed to send to user");
      failed++;
    }
  }
  logger.info({ period, sent, failed }, "report-scheduler: run complete");
}

/* ─── Scheduled midnight run (overlap-aware) ──────────────────── */

async function runMidnightReports(): Promise<void> {
  const now = getISTDate();
  logger.info({ date: now.toDateString() }, "report-scheduler: midnight run");

  const duePeriods: PeriodType[] = ["daily"];
  if (isSunday(now))         duePeriods.push("weekly");
  if (isLastDayOfMonth(now)) duePeriods.push("monthly");

  logger.debug({ duePeriods }, "report-scheduler: due periods");

  const allSettings = await db
    .select({
      userId:  alertSettingsTable.userId,
      daily:   alertSettingsTable.daily,
      weekly:  alertSettingsTable.weekly,
      monthly: alertSettingsTable.monthly,
    })
    .from(alertSettingsTable);

  const verifiedUsers = await db
    .select({ id: usersTable.id, name: usersTable.name, email: usersTable.email })
    .from(usersTable)
    .where(eq(usersTable.emailVerified, true));

  const userMap = new Map(verifiedUsers.map(u => [u.id, u]));

  const buckets: Record<PeriodType, Array<{ id: number; name: string; email: string }>> = {
    daily:   [],
    weekly:  [],
    monthly: [],
  };

  for (const s of allSettings) {
    const user = userMap.get(s.userId);
    if (!user) continue;
    const period = pickPeriod(s, duePeriods);
    if (period) buckets[period].push(user);
  }

  for (const period of ["monthly", "weekly", "daily"] as PeriodType[]) {
    const recipients = buckets[period];
    if (recipients.length === 0) {
      logger.debug({ period }, "report-scheduler: no recipients");
      continue;
    }

    logger.info({ period, recipients: recipients.length }, "report-scheduler: collecting report data");
    const report = await collectReport(period);

    let sent = 0, failed = 0;
    for (const user of recipients) {
      const { html, text, subject } = buildReportEmail(report, user.name);
      try {
        await sendEmail({ to: user.email, subject, html, text });
        sent++;
      } catch (err) {
        logger.error({ err, email: user.email, period }, "report-scheduler: failed to send");
        failed++;
      }
    }
    logger.info({ period, sent, failed }, "report-scheduler: period complete");
  }

  logger.info("report-scheduler: midnight run complete");
}

/* ─── Bootstrap ───────────────────────────────────────────────── */

export function startReportScheduler(): void {
  if (!process.env.BREVO_API_KEY) {
    logger.warn("report-scheduler: BREVO_API_KEY not set — dry-run mode");
  }

  cron.schedule("0 0 * * *", () => {
    runMidnightReports().catch(err =>
      logger.error({ err }, "report-scheduler: midnight run error")
    );
  }, { timezone: "Asia/Kolkata" });

  logger.info(
    { schedule: "midnight IST", note: "monthly > weekly > daily priority on overlap days" },
    "report-scheduler: cron registered",
  );
}
