import express, { type Express } from "express";
import cors from "cors";
import path from "path";
import rateLimit from "express-rate-limit";
import compression from "compression";
import router from "./routes/index.js";
import { requestLogger } from "./middlewares/request-logger.js";
import { logger } from "./lib/logger.js";

const app: Express = express();
const isProd = process.env.NODE_ENV === "production";

app.set("trust proxy", 1);

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many auth attempts, please try again later." },
});

app.use(compression());

if (isProd) {
  app.use((_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
    next();
  });
}

function getAllowedOrigins(): string[] | boolean {
  if (!isProd) return true;
  const appUrl = process.env.APP_URL;
  if (appUrl) return [appUrl];
  return true;
}

app.use(cors({
  origin: getAllowedOrigins(),
  credentials: true,
}));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.use("/api", generalLimiter);
app.use("/api/auth", authLimiter);

app.use("/api", router);

const frontendDist = isProd
  ? path.join(process.cwd(), "frontend/dist/public")
  : path.join(process.cwd(), "backend/public");

app.use(express.static(frontendDist, {
  maxAge: isProd ? "7d" : 0,
  immutable: isProd,
  etag: true,
  lastModified: true,
  setHeaders(res, filePath) {
    if (isProd && /\.[0-9a-f]{8,}\.(js|css|woff2?)$/i.test(filePath)) {
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    }
  },
}));

if (isProd) {
  app.get("/{*splat}", (_req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

export { logger };
export default app;
