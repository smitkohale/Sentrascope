import { Router } from "express";
import { logger } from "../lib/logger.js";

const logsRouter = Router();

logsRouter.post("/logs/event", (req, res) => {
  const { eventType, category, action, metadata, sessionId, userId, path: reqPath } = req.body;

  if (!sessionId || !eventType || !category || !action) {
    res.status(400).json({ error: "sessionId, eventType, category, and action are required" });
    return;
  }

  logger.info(
    {
      kind: "client_event",
      sessionId,
      userId: userId ?? undefined,
      eventType,
      category,
      action,
      path: reqPath ?? undefined,
      metadata: metadata ?? undefined,
      ip:
        (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
        req.socket.remoteAddress,
    },
    `[client] ${category}:${action}`,
  );

  res.status(204).end();
});

export default logsRouter;
