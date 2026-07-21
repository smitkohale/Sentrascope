import { Router, type IRouter } from "express";
import { GetUvDataQueryParams } from "@workspace/api-zod";
import { uvCache } from "../lib/api-cache.js";

const router: IRouter = Router();

const TTL_MS = 15 * 60 * 1000;

router.get("/uv", async (req, res) => {
  const apiKey = process.env.OPENUV_API_KEY;
  if (!apiKey) {
    res.status(503).json({
      error: "not_configured",
      message: "OPENUV_API_KEY is not configured. Add it in Replit Secrets.",
    });
    return;
  }

  const parsed = GetUvDataQueryParams.safeParse({
    ...req.query,
    lat: req.query.lat ? Number(req.query.lat) : undefined,
    lon: req.query.lon ? Number(req.query.lon) : undefined,
    alt: req.query.alt ? Number(req.query.alt) : undefined,
  });

  if (!parsed.success) {
    res.status(400).json({
      error: "invalid_params",
      message: parsed.error.message,
    });
    return;
  }

  const { lat, lon, alt, dt } = parsed.data;
  const cacheKey = `${lat.toFixed(2)}:${lon.toFixed(2)}:${dt ?? "now"}`;

  const cached = uvCache.get(cacheKey);
  if (cached) {
    res.setHeader("Cache-Control", `public, max-age=${Math.floor(TTL_MS / 1000)}`);
    res.setHeader("X-Cache", "HIT");
    res.json(cached);
    return;
  }

  const params = new URLSearchParams({
    lat: String(lat),
    lng: String(lon),
  });
  if (alt !== undefined) params.append("alt", String(alt));
  if (dt) params.append("dt", dt);

  const url = `https://api.openuv.io/api/v1/uv?${params.toString()}`;

  try {
    const response = await fetch(url, {
      headers: {
        "x-access-token": apiKey,
        "Content-Type": "application/json",
      },
    });

    const json = await response.json() as Record<string, unknown>;

    if (!response.ok) {
      res.status(502).json({
        error: "upstream_error",
        message: (json.error as string) || `OpenUV API returned ${response.status}`,
      });
      return;
    }

    const raw = json.result as Record<string, unknown> | undefined;
    if (!raw) {
      res.status(502).json({ error: "no_result", message: "OpenUV returned no result" });
      return;
    }

    const data = {
      result: {
        uv: typeof raw.uv === "number" ? raw.uv : 0,
        uv_time: typeof raw.uv_time === "string" ? raw.uv_time : new Date().toISOString(),
        uv_max: typeof raw.uv_max === "number" ? raw.uv_max : null,
        uv_max_time: typeof raw.uv_max_time === "string" ? raw.uv_max_time : null,
        ozone: typeof raw.ozone === "number" ? raw.ozone : null,
        ozone_time: typeof raw.ozone_time === "string" ? raw.ozone_time : null,
        safe_exposure_time: (raw.safe_exposure_time as Record<string, number>) ?? null,
        sun_info: (raw.sun_info as Record<string, unknown>) ?? null,
      },
    };

    uvCache.set(cacheKey, data, TTL_MS);
    res.setHeader("Cache-Control", `public, max-age=${Math.floor(TTL_MS / 1000)}`);
    res.setHeader("X-Cache", "MISS");
    res.json(data);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const { logger } = await import("../lib/logger.js");
    logger.error({ err: msg }, "OpenUV fetch error");
    res.status(502).json({
      error: "fetch_error",
      message: "Failed to connect to OpenUV service",
    });
  }
});

export default router;
