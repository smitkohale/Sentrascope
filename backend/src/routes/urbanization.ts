import { Router, Request, Response } from "express";

const router = Router();

const PROJECT_ID = process.env.GEE_PROJECT_ID || "poetic-diorama-483911-u8";

let eeInitialized = false;
let eeInitializing = false;
let eeReady = false;

const tileCache = new Map<string, { result: any; expiresAt: number }>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

async function initializeEE(): Promise<boolean> {
  if (eeReady) return true;
  if (eeInitializing) {
    await new Promise(r => setTimeout(r, 2000));
    return eeReady;
  }

  const keyRaw = process.env.GEE_SERVICE_ACCOUNT_KEY;
  if (!keyRaw) return false;

  try {
    eeInitializing = true;
    const key = JSON.parse(keyRaw);
    const ee = await import("@google/earthengine");
    const eeLib = (ee as any).default ?? ee;

    await new Promise<void>((resolve, reject) => {
      eeLib.data.authenticateViaPrivateKey(
        key,
        () => {
          eeLib.initialize(
            null, null,
            () => { eeReady = true; resolve(); },
            (err: any) => reject(new Error(String(err)))
          );
        },
        (err: any) => reject(new Error(String(err)))
      );
    });

    const { logger } = await import("../lib/logger.js");
    logger.info("GEE: Earth Engine initialized with service account");
    return true;
  } catch (err) {
    const { logger } = await import("../lib/logger.js");
    logger.error({ err }, "GEE: initialization failed");
    eeInitializing = false;
    return false;
  }
}

async function getMapId(image: any, visParams: Record<string, any>): Promise<string> {
  return new Promise((resolve, reject) => {
    image.getMapId(visParams, (mapid: any, error: any) => {
      if (error) reject(new Error(String(error)));
      else resolve(mapid.urlFormat as string);
    });
  });
}

router.get("/urbanization/tiles", async (req: Request, res: Response) => {
  const { fromDate, toDate, threshold } = req.query;

  if (!fromDate || !toDate) {
    return res.status(400).json({ error: "fromDate and toDate are required" });
  }

  const thresh = parseFloat(String(threshold ?? "0.15"));
  const from = String(fromDate);
  const to = String(toDate);
  const cacheKey = `${from}::${to}::${thresh}`;

  const cached = tileCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return res.json(cached.result);
  }

  const ready = await initializeEE();
  if (!ready) {
    return res.status(503).json({
      error: "GEE_NOT_CONFIGURED",
      message:
        "Google Earth Engine credentials not configured. " +
        "Please provide your GEE service account JSON key as the GEE_SERVICE_ACCOUNT_KEY environment variable.",
    });
  }

  try {
    const ee = await import("@google/earthengine");
    const lib = (ee as any).default ?? ee;

    const districts = lib.FeatureCollection("FAO/GAUL/2015/level2");
    const aoi = districts.filter(
      lib.Filter.and(
        lib.Filter.eq("ADM0_NAME", "India"),
        lib.Filter.eq("ADM2_NAME", "Nagpur")
      )
    );

    function maskS2Clouds(image: any) {
      const scl = image.select("SCL");
      const mask = scl.neq(3).and(scl.neq(8)).and(scl.neq(9)).and(scl.neq(10)).and(scl.neq(11));
      return image.updateMask(mask).divide(10000);
    }

    function makeComposite(start: string, end: string) {
      return lib
        .ImageCollection("COPERNICUS/S2_SR")
        .filterDate(start, end)
        .filterBounds(aoi)
        .filter(lib.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", 20))
        .map(maskS2Clouds)
        .select(["B2", "B3", "B4", "B8", "B11"])
        .median()
        .clip(aoi);
    }

    const fromD = new Date(from);
    const toD = new Date(to);

    const baseStart = new Date(fromD.getTime() - 45 * 86400000).toISOString().split("T")[0];
    const baseEnd = new Date(fromD.getTime() + 45 * 86400000).toISOString().split("T")[0];
    const recStart = new Date(toD.getTime() - 45 * 86400000).toISOString().split("T")[0];
    const recEnd = new Date(toD.getTime() + 45 * 86400000).toISOString().split("T")[0];

    const img1 = makeComposite(baseStart, baseEnd);
    const img2 = makeComposite(recStart, recEnd);

    const ndbi1 = img1.normalizedDifference(["B11", "B8"]).rename("NDBI");
    const ndbi2 = img2.normalizedDifference(["B11", "B8"]).rename("NDBI");

    const change = ndbi2.subtract(ndbi1);
    // Match Colab: require NDBI > 0.0 in recent image (genuine built-up)
    const actuallyBuiltup = ndbi2.gt(0.0);
    // Match Colab: focal_min(1).focal_max(1) for morphological cleaning
    const expansion = change
      .gt(thresh)
      .and(actuallyBuiltup)
      .focal_min(1)
      .focal_max(1);

    // Broaden DW window to full year for better coverage
    const dwStart = new Date(toD.getTime() - 180 * 86400000).toISOString().split("T")[0];
    const dwEnd = new Date(toD.getTime() + 45 * 86400000).toISOString().split("T")[0];
    const dw = lib
      .ImageCollection("GOOGLE/DYNAMICWORLD/V1")
      .filterDate(dwStart, dwEnd)
      .filterBounds(aoi)
      .mode()
      .clip(aoi);

    // Public land = water (0), trees (1), flooded vegetation (4), shrub/scrub (6)
    const dwLabel = dw.select("label");
    const publicMask = dwLabel.eq(0)
      .or(dwLabel.eq(1))
      .or(dwLabel.eq(4))
      .or(dwLabel.eq(6));
    const illegalExpansion = expansion.and(publicMask);

    const rgbVis = { bands: ["B4", "B3", "B2"], min: 0, max: 0.3 };
    const expansionVis = { palette: ["ff0000"] };
    const illegalVis = { palette: ["ff4500"] };
    const ndbiVis = { min: -0.3, max: 0.3, palette: ["2166ac", "f7f7f7", "b2182b"] };

    const [baselineTiles, recentTiles, expansionTiles, illegalTiles, ndbiTiles] =
      await Promise.all([
        getMapId(img1, rgbVis),
        getMapId(img2, rgbVis),
        getMapId(expansion.selfMask(), expansionVis),
        getMapId(illegalExpansion.selfMask(), illegalVis),
        getMapId(ndbi2.select("NDBI"), ndbiVis),
      ]);

    const areaResult: { NDBI?: number } = await new Promise((resolve, reject) => {
      expansion
        .selfMask()
        .multiply(lib.Image.pixelArea())
        .reduceRegion({
          reducer: lib.Reducer.sum(),
          geometry: aoi.geometry(),
          scale: 200,
          maxPixels: 1e8,
          bestEffort: true,
        })
        .getInfo((result: any, error: any) => {
          if (error) reject(new Error(String(error)));
          else resolve(result);
        });
    });

    const illegalArea: { NDBI?: number } = await new Promise((resolve, reject) => {
      illegalExpansion
        .selfMask()
        .multiply(lib.Image.pixelArea())
        .reduceRegion({
          reducer: lib.Reducer.sum(),
          geometry: aoi.geometry(),
          scale: 200,
          maxPixels: 1e8,
          bestEffort: true,
        })
        .getInfo((result: any, error: any) => {
          if (error) reject(new Error(String(error)));
          else resolve(result);
        });
    });

    const areaSqKm = ((areaResult?.NDBI ?? 0) / 1e6);
    const illegalSqKm = ((illegalArea?.NDBI ?? 0) / 1e6);

    const payload = {
      tiles: {
        baseline: baselineTiles,
        recent: recentTiles,
        expansion: expansionTiles,
        flagged: illegalTiles,
        ndbi: ndbiTiles,
      },
      stats: {
        areaSqKm: +areaSqKm.toFixed(2),
        illegalSqKm: +illegalSqKm.toFixed(2),
        fromDate: from,
        toDate: to,
        threshold: thresh,
      },
      bounds: {
        center: [21.15, 79.09],
        zoom: 10,
      },
    };

    tileCache.set(cacheKey, { result: payload, expiresAt: Date.now() + CACHE_TTL_MS });
    return res.json(payload);
  } catch (err: any) {
    const { logger } = await import("../lib/logger.js");
    logger.error({ err }, "GEE: analysis error");
    return res.status(500).json({ error: "GEE_ERROR", message: err.message });
  }
});

router.get("/urbanization/status", async (_req: Request, res: Response) => {
  const hasKey = !!process.env.GEE_SERVICE_ACCOUNT_KEY;
  if (!hasKey) {
    return res.json({ configured: false, message: "GEE service account key not set" });
  }
  const ready = await initializeEE();
  return res.json({ configured: true, ready, projectId: PROJECT_ID });
});

router.delete("/urbanization/cache", (_req: Request, res: Response) => {
  tileCache.clear();
  return res.json({ cleared: true });
});

export default router;
