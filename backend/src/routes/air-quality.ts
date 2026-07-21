import { Router, type IRouter } from "express";
import { GetAirQualityQueryParams, GetAirQualityResponse } from "@workspace/api-zod";
import { airQualityCache } from "../lib/api-cache.js";

const router: IRouter = Router();

const TTL_MS = 10 * 60 * 1000;

router.get("/air-quality", async (req, res) => {
  const token = process.env.WAQI_API_TOKEN || "demo";

  const parsed = GetAirQualityQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({
      error: "invalid_params",
      message: parsed.error.message,
    });
    return;
  }

  const { city, lat, lon } = parsed.data;

  let url: string;
  let cacheKey: string;
  if (city) {
    cacheKey = `city:${city.toLowerCase()}`;
    url = `https://api.waqi.info/feed/${encodeURIComponent(city)}/?token=${token}`;
  } else if (lat !== undefined && lon !== undefined) {
    cacheKey = `geo:${lat.toFixed(2)}:${lon.toFixed(2)}`;
    url = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${token}`;
  } else {
    cacheKey = `city:delhi`;
    url = `https://api.waqi.info/feed/delhi/?token=${token}`;
  }

  const cached = airQualityCache.get(cacheKey);
  if (cached) {
    res.setHeader("Cache-Control", `public, max-age=${Math.floor(TTL_MS / 1000)}`);
    res.setHeader("X-Cache", "HIT");
    res.json(cached);
    return;
  }

  try {
    const response = await fetch(url);
    const json = await response.json() as Record<string, unknown>;

    if (!response.ok || (json.status as string) === "error") {
      res.status(502).json({
        error: "upstream_error",
        message: (json.data as string) || "Failed to fetch air quality data",
      });
      return;
    }

    const data = GetAirQualityResponse.parse({
      status: json.status,
      data: {
        aqi: (json.data as Record<string, unknown>)?.aqi,
        city: ((json.data as Record<string, unknown>)?.city as Record<string, unknown>)?.name || city || "Unknown",
        station: ((json.data as Record<string, unknown>)?.city as Record<string, unknown>)?.name,
        dominentpol: (json.data as Record<string, unknown>)?.dominentpol,
        time: ((json.data as Record<string, unknown>)?.time as Record<string, unknown>)?.s,
        iaqi: (json.data as Record<string, unknown>)?.iaqi,
        forecast: (json.data as Record<string, unknown>)?.forecast,
        attributions: (json.data as Record<string, unknown>)?.attributions,
      },
    });

    airQualityCache.set(cacheKey, data, TTL_MS);
    res.setHeader("Cache-Control", `public, max-age=${Math.floor(TTL_MS / 1000)}`);
    res.setHeader("X-Cache", "MISS");
    res.json(data);
  } catch (err) {
    const { logger } = await import("../lib/logger.js");
    logger.error({ err }, "air-quality fetch error");
    res.status(502).json({
      error: "fetch_error",
      message: "Failed to connect to air quality service",
    });
  }
});

export default router;
