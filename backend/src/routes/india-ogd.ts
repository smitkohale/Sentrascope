import { Router, type IRouter } from "express";
import { GetIndiaOgdAirQualityQueryParams, GetIndiaOgdAirQualityResponse } from "@workspace/api-zod";
import { indiaOgdCache } from "../lib/api-cache.js";

const router: IRouter = Router();

const RESOURCE_ID = "3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69";
const TTL_MS = 60 * 60 * 1000;

router.get("/india-ogd/air-quality", async (req, res) => {
  const apiKey = process.env.INDIA_OGD_API_KEY;
  if (!apiKey) {
    res.status(503).json({
      error: "not_configured",
      message: "INDIA_OGD_API_KEY is not configured. Add it in Replit Secrets.",
    });
    return;
  }

  const parsed = GetIndiaOgdAirQualityQueryParams.safeParse({
    ...req.query,
    limit: req.query.limit ? Number(req.query.limit) : 100,
  });

  if (!parsed.success) {
    res.status(400).json({
      error: "invalid_params",
      message: parsed.error.message,
    });
    return;
  }

  const { state, city, limit } = parsed.data;
  const cacheKey = `${state ?? "all"}:${city ?? "all"}:${limit ?? 100}`;

  const cached = indiaOgdCache.get(cacheKey);
  if (cached) {
    res.setHeader("Cache-Control", `public, max-age=${Math.floor(TTL_MS / 1000)}`);
    res.setHeader("X-Cache", "HIT");
    res.json(cached);
    return;
  }

  const params = new URLSearchParams({
    "api-key": apiKey,
    format: "json",
    "resource_id": RESOURCE_ID,
    limit: String(limit ?? 100),
  });

  if (state) params.append("filters[state]", state);
  if (city) params.append("filters[city]", city);

  const url = `https://api.data.gov.in/resource/${RESOURCE_ID}?${params.toString()}`;

  try {
    const response = await fetch(url);
    const json = await response.json() as Record<string, unknown>;

    if (!response.ok || json.status === "error") {
      res.status(502).json({
        error: "upstream_error",
        message: (json.message as string) || `India OGD API returned ${response.status}`,
      });
      return;
    }

    const records = (json.records as unknown[]) || [];

    const data = GetIndiaOgdAirQualityResponse.parse({
      status: json.status || "ok",
      total: json.total || records.length,
      count: records.length,
      records: records.map((r) => {
        const record = r as Record<string, string>;
        return {
          state: record.state,
          city: record.city,
          station: record.station,
          pollutant_id: record.pollutant_id,
          pollutant_min: record.pollutant_min,
          pollutant_max: record.pollutant_max,
          pollutant_avg: record.pollutant_avg,
          pollutant_unit: record.pollutant_unit,
          last_update: record.last_update,
        };
      }),
    });

    indiaOgdCache.set(cacheKey, data, TTL_MS);
    res.setHeader("Cache-Control", `public, max-age=${Math.floor(TTL_MS / 1000)}`);
    res.setHeader("X-Cache", "MISS");
    res.json(data);
  } catch (err) {
    const { logger } = await import("../lib/logger.js");
    logger.error({ err }, "india-ogd fetch error");
    res.status(502).json({
      error: "fetch_error",
      message: "Failed to connect to India Open Government Data service",
    });
  }
});

export default router;
