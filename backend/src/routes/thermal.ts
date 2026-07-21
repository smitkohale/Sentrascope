import { Router, type IRouter } from "express";
import { GetThermalFiresQueryParams, GetThermalFiresResponse } from "@workspace/api-zod";
import { thermalCache } from "../lib/api-cache.js";

const router: IRouter = Router();

const TTL_MS = 30 * 60 * 1000;

router.get("/thermal/fires", async (req, res) => {
  const mapKey = process.env.NASA_FIRMS_MAP_KEY;
  if (!mapKey) {
    res.status(503).json({
      error: "not_configured",
      message: "NASA_FIRMS_MAP_KEY is not configured. Add it in Replit Secrets.",
    });
    return;
  }

  const parsed = GetThermalFiresQueryParams.safeParse({
    ...req.query,
    dayRange: req.query.dayRange ? Number(req.query.dayRange) : 1,
    lat: req.query.lat ? Number(req.query.lat) : undefined,
    lon: req.query.lon ? Number(req.query.lon) : undefined,
  });

  if (!parsed.success) {
    res.status(400).json({
      error: "invalid_params",
      message: parsed.error.message,
    });
    return;
  }

  const { source, dayRange } = parsed.data;
  const days = dayRange ?? 1;

  const SOURCES_TO_TRY = source
    ? [source]
    : ["VIIRS_SNPP_NRT", "VIIRS_NOAA20_NRT", "MODIS_NRT"];

  const cacheKey = `${source ?? "auto"}:${days}`;
  const cached = thermalCache.get(cacheKey);
  if (cached) {
    res.setHeader("Cache-Control", `public, max-age=${Math.floor(TTL_MS / 1000)}`);
    res.setHeader("X-Cache", "HIT");
    res.json(cached);
    return;
  }

  let lastStatus = 0;
  let lastStatusText = "";
  let csvText: string | null = null;
  let usedSource = SOURCES_TO_TRY[0];

  for (const src of SOURCES_TO_TRY) {
    const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${mapKey}/${src}/68,8,97,37/${days}`;
    try {
      const response = await fetch(url);
      lastStatus = response.status;
      lastStatusText = response.statusText;
      if (response.ok) {
        const text = await response.text();
        if (
          !text.includes("Invalid MAP_KEY") &&
          !text.includes("ERROR") &&
          !text.includes("Invalid API")
        ) {
          csvText = text;
          usedSource = src;
          break;
        }
      }
    } catch (_) {
    }
  }

  try {
    if (csvText === null) {
      res.status(502).json({
        error: "upstream_error",
        message: `NASA FIRMS API returned ${lastStatus}: ${lastStatusText}`,
      });
      return;
    }

    const lines = csvText.trim().split("\n");
    if (lines.length < 2) {
      const data = GetThermalFiresResponse.parse({
        count: 0,
        source: usedSource,
        hotspots: [],
      });
      thermalCache.set(cacheKey, data, TTL_MS);
      res.setHeader("Cache-Control", `public, max-age=${Math.floor(TTL_MS / 1000)}`);
      res.setHeader("X-Cache", "MISS");
      res.json(data);
      return;
    }

    const headers = lines[0].split(",");
    const hotspots = lines.slice(1).map((line) => {
      const values = line.split(",");
      const row: Record<string, string> = {};
      headers.forEach((h, i) => {
        row[h.trim()] = values[i]?.trim() ?? "";
      });
      return {
        latitude: parseFloat(row.latitude ?? row.lat ?? "0"),
        longitude: parseFloat(row.longitude ?? row.lon ?? "0"),
        brightness: parseFloat(row.brightness ?? row.bright_ti4 ?? "0") || undefined,
        frp: parseFloat(row.frp ?? "0") || undefined,
        confidence: row.confidence,
        acq_date: row.acq_date,
        acq_time: row.acq_time,
        satellite: row.satellite,
        instrument: row.instrument,
        daynight: row.daynight,
        type: row.type ? parseInt(row.type) : undefined,
      };
    }).filter((h) => !isNaN(h.latitude) && !isNaN(h.longitude));

    const data = GetThermalFiresResponse.parse({
      count: hotspots.length,
      source: usedSource,
      hotspots,
    });

    thermalCache.set(cacheKey, data, TTL_MS);
    res.setHeader("Cache-Control", `public, max-age=${Math.floor(TTL_MS / 1000)}`);
    res.setHeader("X-Cache", "MISS");
    res.json(data);
  } catch (err) {
    const { logger } = await import("../lib/logger.js");
    logger.error({ err }, "NASA FIRMS fetch error");
    res.status(502).json({
      error: "fetch_error",
      message: "Failed to connect to NASA FIRMS service",
    });
  }
});

export default router;
