import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { alertSettingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../lib/auth-middleware.js";
import { logger } from "../lib/logger.js";

const router: IRouter = Router();

router.get("/alerts", requireAuth, async (req: AuthRequest, res) => {
  const userId = req.user!.userId;
  try {
    const [settings] = await db.select().from(alertSettingsTable).where(
      eq(alertSettingsTable.userId, userId)
    ).limit(1);
    if (!settings) {
      res.json({ daily: true, weekly: false, monthly: false });
      return;
    }
    res.json({ daily: settings.daily, weekly: settings.weekly, monthly: settings.monthly });
  } catch (err) {
    logger.error({ err, userId }, "alerts/get failed");
    res.status(500).json({ error: "internal", message: "Failed to load settings." });
  }
});

router.post("/alerts", requireAuth, async (req: AuthRequest, res) => {
  const userId = req.user!.userId;
  const { daily, weekly, monthly } = req.body as { daily?: boolean; weekly?: boolean; monthly?: boolean };

  const dailyVal  = typeof daily   === "boolean" ? daily   : true;
  const weeklyVal = typeof weekly  === "boolean" ? weekly  : false;
  const monthlyVal = typeof monthly === "boolean" ? monthly : false;

  try {
    await db.insert(alertSettingsTable)
      .values({ userId, daily: dailyVal, weekly: weeklyVal, monthly: monthlyVal })
      .onConflictDoUpdate({
        target: alertSettingsTable.userId,
        set: { daily: dailyVal, weekly: weeklyVal, monthly: monthlyVal, updatedAt: new Date() },
      });
    res.json({ message: "Alert settings saved." });
  } catch (err) {
    logger.error({ err, userId }, "alerts/post failed");
    res.status(500).json({ error: "internal", message: "Failed to save settings." });
  }
});

export default router;
