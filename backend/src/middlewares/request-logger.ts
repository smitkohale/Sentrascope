import pinoHttp from "pino-http";
import { logger } from "../lib/logger.js";

const SKIP_PATHS = new Set(["/api/healthz", "/api/logs/event"]);

export const requestLogger = pinoHttp({
  logger,
  autoLogging: {
    ignore(req) {
      return SKIP_PATHS.has(req.url?.split("?")[0] ?? "");
    },
  },
  customLogLevel(_req, res, err) {
    if (err || res.statusCode >= 500) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },
  customSuccessMessage(req, res) {
    return `${req.method} ${req.url} → ${res.statusCode}`;
  },
  customErrorMessage(req, _res, err) {
    return `${req.method} ${req.url} — ${err.message}`;
  },
  serializers: {
    req(req) {
      return {
        method: req.method,
        url: req.url,
        ip:
          (req.headers?.["x-forwarded-for"] as string)
            ?.split(",")[0]
            ?.trim() ?? req.socket?.remoteAddress,
      };
    },
    res(res) {
      return { statusCode: res.statusCode };
    },
  },
});
