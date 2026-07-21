export type PeriodType = "daily" | "weekly" | "monthly";

export type StateMetrics = {
  name: string;
  aqi: number;
  aqiLabel: string;
  thermalHotspots: number;
  uvIndex: number;
  uvLabel: string;
  noiseDb: number;
  noiseLabel: string;
};

export type EnvironmentReport = {
  period: PeriodType;
  generatedAt: Date;
  india: {
    avgAqi: number;
    aqiLabel: string;
    totalHotspots: number;
    uvIndex: number;
    uvLabel: string;
    avgNoise: number;
    noiseLabel: string;
  };
  states: StateMetrics[];
};

const INDIA_CENTER = { lat: 20.5937, lon: 78.9629 };

const STATE_DEFS: { name: string; lat: number; lon: number; industrial: number; density: number }[] = [
  { name: "Andaman & Nicobar",    lat: 11.7401, lon: 92.6586, industrial: 15,  density: 46    },
  { name: "Andhra Pradesh",       lat: 15.9129, lon: 79.7400, industrial: 65,  density: 304   },
  { name: "Arunachal Pradesh",    lat: 28.2180, lon: 94.7278, industrial: 10,  density: 17    },
  { name: "Assam",                lat: 26.2006, lon: 92.9376, industrial: 40,  density: 398   },
  { name: "Bihar",                lat: 25.0961, lon: 85.3131, industrial: 35,  density: 1106  },
  { name: "Chandigarh",           lat: 30.7333, lon: 76.7794, industrial: 50,  density: 9258  },
  { name: "Chhattisgarh",         lat: 21.2787, lon: 81.8661, industrial: 85,  density: 189   },
  { name: "Dadra & Nagar Haveli", lat: 20.1809, lon: 73.0169, industrial: 70,  density: 700   },
  { name: "Daman & Diu",          lat: 20.4283, lon: 72.8397, industrial: 75,  density: 2191  },
  { name: "Delhi",                lat: 28.6139, lon: 77.2090, industrial: 80,  density: 11320 },
  { name: "Goa",                  lat: 15.2993, lon: 74.1240, industrial: 30,  density: 394   },
  { name: "Gujarat",              lat: 22.2587, lon: 71.1924, industrial: 95,  density: 308   },
  { name: "Haryana",              lat: 29.0588, lon: 76.0856, industrial: 88,  density: 573   },
  { name: "Himachal Pradesh",     lat: 31.1048, lon: 77.1734, industrial: 45,  density: 123   },
  { name: "Jammu & Kashmir",      lat: 33.7782, lon: 76.5762, industrial: 25,  density: 56    },
  { name: "Jharkhand",            lat: 23.6102, lon: 85.2799, industrial: 92,  density: 414   },
  { name: "Karnataka",            lat: 15.3173, lon: 75.7139, industrial: 78,  density: 319   },
  { name: "Kerala",               lat: 10.8505, lon: 76.2711, industrial: 40,  density: 860   },
  { name: "Ladakh",               lat: 34.1526, lon: 77.5771, industrial: 5,   density: 3     },
  { name: "Lakshadweep",          lat: 10.5667, lon: 72.6417, industrial: 2,   density: 2149  },
  { name: "Madhya Pradesh",       lat: 22.9734, lon: 78.6569, industrial: 60,  density: 236   },
  { name: "Maharashtra",          lat: 19.7515, lon: 75.7139, industrial: 98,  density: 365   },
  { name: "Manipur",              lat: 24.6637, lon: 93.9063, industrial: 12,  density: 115   },
  { name: "Meghalaya",            lat: 25.4670, lon: 91.3662, industrial: 18,  density: 132   },
  { name: "Mizoram",              lat: 23.1645, lon: 92.9376, industrial: 8,   density: 52    },
  { name: "Nagaland",             lat: 26.1584, lon: 94.5624, industrial: 10,  density: 119   },
  { name: "Odisha",               lat: 20.9517, lon: 85.0985, industrial: 82,  density: 270   },
  { name: "Puducherry",           lat: 11.9416, lon: 79.8083, industrial: 35,  density: 2547  },
  { name: "Punjab",               lat: 31.1471, lon: 75.3412, industrial: 70,  density: 551   },
  { name: "Rajasthan",            lat: 27.0238, lon: 74.2179, industrial: 65,  density: 200   },
  { name: "Sikkim",               lat: 27.5330, lon: 88.5122, industrial: 15,  density: 86    },
  { name: "Tamil Nadu",           lat: 11.1271, lon: 78.6569, industrial: 90,  density: 555   },
  { name: "Telangana",            lat: 18.1124, lon: 79.0193, industrial: 75,  density: 312   },
  { name: "Tripura",              lat: 23.9408, lon: 91.9882, industrial: 20,  density: 350   },
  { name: "Uttar Pradesh",        lat: 26.8467, lon: 80.9462, industrial: 75,  density: 829   },
  { name: "Uttarakhand",          lat: 30.0668, lon: 79.0193, industrial: 40,  density: 189   },
  { name: "West Bengal",          lat: 22.9868, lon: 87.8550, industrial: 88,  density: 1028  },
];

function calcNoise(industrial: number, density: number): number {
  const base = 38;
  const ind = industrial * 0.35;
  const den = Math.min(Math.log10(density + 1) * 6, 25);
  return Math.round(Math.min(base + ind + den, 108));
}

function aqiLabel(aqi: number | null): string {
  if (aqi === null) return "N/A";
  if (aqi <= 50)  return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy (Sensitive)";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
}

function uvLabel(uv: number | null): string {
  if (uv === null) return "N/A";
  if (uv < 3)  return "Low";
  if (uv < 6)  return "Moderate";
  if (uv < 8)  return "High";
  if (uv < 11) return "Very High";
  return "Extreme";
}

function noiseLabel(db: number): string {
  if (db < 50) return "Quiet";
  if (db < 60) return "Moderate";
  if (db < 70) return "Loud";
  if (db < 80) return "Very Loud";
  return "Dangerous";
}

function periodDays(period: PeriodType): number {
  if (period === "daily")  return 1;
  if (period === "weekly") return 7;
  return 30;
}

function estimateAqiForState(industrial: number, density: number): number {
  const base = 28;
  const indFactor = industrial * 0.85;
  const denFactor = Math.min(Math.log10(density + 1) * 12, 45);
  const month = new Date().getMonth();
  const winterBoost = (month >= 10 || month <= 1) ? 25 : 0;
  return Math.round(Math.max(12, Math.min(base + indFactor + denFactor + winterBoost, 400)));
}

function estimateStateHotspots(industrial: number, density: number): number {
  const month = new Date().getMonth();
  const summerBase = (month >= 2 && month <= 5) ? 8 : 2;
  return Math.round(summerBase * (industrial / 100) * (1 + Math.log10(density + 1) / 5));
}

type OgdRecord = { state?: string; pollutant_id?: string; pollutant_avg?: string };

async function fetchOgdAqi(): Promise<Map<string, number>> {
  const apiKey = process.env.INDIA_OGD_API_KEY;
  if (!apiKey) return new Map();

  const resourceId = "3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69";
  const url = `https://api.data.gov.in/resource/${resourceId}?api-key=${apiKey}&format=json&limit=500`;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return new Map();
    const json = await res.json() as { records?: OgdRecord[] };
    const records: OgdRecord[] = json.records ?? [];

    const stateVals: Map<string, number[]> = new Map();
    for (const r of records) {
      const state = (r.state ?? "").trim();
      const pol = (r.pollutant_id ?? "").toUpperCase();
      const avg = parseFloat(r.pollutant_avg ?? "");
      if (!state || isNaN(avg) || avg <= 0) continue;
      if (pol !== "PM2.5" && pol !== "PM10" && pol !== "AQI") continue;
      if (!stateVals.has(state)) stateVals.set(state, []);
      stateVals.get(state)!.push(avg);
    }

    const result: Map<string, number> = new Map();
    for (const [state, vals] of stateVals) {
      const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
      result.set(state.toLowerCase(), Math.round(avg));
    }
    return result;
  } catch {
    return new Map();
  }
}

type FirmsRow = { latitude?: string; longitude?: string; lat?: string; lon?: string };

async function fetchFirmsRows(period: PeriodType): Promise<FirmsRow[]> {
  const mapKey = process.env.NASA_FIRMS_MAP_KEY;
  if (!mapKey) return [];
  const days = periodDays(period);
  const url = `https://firms.modaps.eosdis.nasa.gov/api/country/csv/${mapKey}/VIIRS_SNPP_NRT/IND/${days}`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) return [];
    const text = await res.text();
    if (text.includes("Invalid") || text.includes("ERROR")) return [];
    const lines = text.trim().split("\n");
    if (lines.length < 2) return [];
    const headers = lines[0].split(",").map(h => h.trim());
    return lines.slice(1).map(line => {
      const vals = line.split(",");
      const row: Record<string, string> = {};
      headers.forEach((h, i) => { row[h] = vals[i]?.trim() ?? ""; });
      return row as FirmsRow;
    });
  } catch {
    return [];
  }
}

function estimateUvByLatAndMonth(lat: number): number {
  const month = new Date().getMonth();
  const monthlyPeakUv = [7, 8, 9, 10, 11, 10, 8, 8, 9, 8, 6, 6];
  const baseUv = monthlyPeakUv[month] ?? 7;
  // Adjust for latitude: closer to equator = higher UV (~0.08 per degree from 20°N centre)
  const latAdjust = (20 - lat) * 0.08;
  return Math.round(Math.max(1, Math.min(baseUv + latAdjust, 13)) * 10) / 10;
}

async function fetchUvForCoord(lat: number, lon: number): Promise<number> {
  // Try OpenUV API if key is available
  const apiKey = process.env.OPENUV_API_KEY;
  if (apiKey) {
    try {
      const url = `https://api.openuv.io/api/v1/uv?lat=${lat}&lng=${lon}`;
      const res = await fetch(url, { headers: { "x-access-token": apiKey }, signal: AbortSignal.timeout(6000) });
      if (res.ok) {
        const json = await res.json() as { result?: { uv?: number; uv_max?: number } };
        const uv = json.result?.uv ?? json.result?.uv_max;
        if (typeof uv === "number" && uv > 0) return Math.round(uv * 10) / 10;
      }
    } catch {
    }
  }

  // Fall back to Open-Meteo (free, no key needed)
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=uv_index_max&timezone=Asia%2FKolkata&forecast_days=1`;
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (res.ok) {
      const json = await res.json() as { daily?: { uv_index_max?: number[] } };
      const uvMax = json.daily?.uv_index_max?.[0];
      if (typeof uvMax === "number" && uvMax > 0) return Math.round(uvMax * 10) / 10;
    }
  } catch {
  }

  return estimateUvByLatAndMonth(lat);
}

function countHotspotsInBbox(
  rows: FirmsRow[],
  latMin: number,
  latMax: number,
  lonMin: number,
  lonMax: number,
): number {
  return rows.filter(r => {
    const lat = parseFloat((r.latitude ?? r.lat) ?? "");
    const lon = parseFloat((r.longitude ?? r.lon) ?? "");
    if (isNaN(lat) || isNaN(lon)) return false;
    return lat >= latMin && lat <= latMax && lon >= lonMin && lon <= lonMax;
  }).length;
}

const STATE_BBOX: Record<string, [number, number, number, number]> = {
  "Andaman & Nicobar":    [6.75,  13.7,  92.2,  93.9 ],
  "Andhra Pradesh":       [12.6,  19.9,  76.7,  84.8 ],
  "Arunachal Pradesh":    [26.6,  29.5,  91.5,  97.4 ],
  "Assam":                [24.1,  28.2,  89.7,  96.0 ],
  "Bihar":                [24.3,  27.5,  83.3,  88.3 ],
  "Chandigarh":           [30.6,  30.9,  76.6,  76.9 ],
  "Chhattisgarh":         [17.7,  24.1,  80.2,  84.4 ],
  "Dadra & Nagar Haveli": [20.0,  20.4,  72.8,  73.3 ],
  "Daman & Diu":          [20.3,  20.6,  72.7,  73.0 ],
  "Delhi":                [28.4,  28.9,  76.8,  77.4 ],
  "Goa":                  [14.9,  15.8,  73.7,  74.4 ],
  "Gujarat":              [20.1,  24.7,  68.2,  74.5 ],
  "Haryana":              [27.6,  30.9,  74.5,  77.6 ],
  "Himachal Pradesh":     [30.2,  33.3,  75.6,  79.0 ],
  "Jammu & Kashmir":      [32.3,  36.6,  73.7,  80.4 ],
  "Jharkhand":            [21.9,  25.3,  83.3,  87.9 ],
  "Karnataka":            [11.6,  18.4,  74.0,  78.6 ],
  "Kerala":               [8.3,   12.8,  74.9,  77.4 ],
  "Ladakh":               [32.0,  36.2,  76.3,  80.4 ],
  "Lakshadweep":          [8.0,   12.5,  71.8,  74.1 ],
  "Madhya Pradesh":       [21.1,  26.9,  74.0,  82.8 ],
  "Maharashtra":          [15.6,  22.0,  72.6,  80.9 ],
  "Manipur":              [23.8,  25.7,  93.0,  94.8 ],
  "Meghalaya":            [25.0,  26.1,  89.8,  92.8 ],
  "Mizoram":              [21.9,  24.5,  92.3,  93.5 ],
  "Nagaland":             [25.2,  27.0,  93.3,  95.2 ],
  "Odisha":               [17.8,  22.6,  81.4,  87.5 ],
  "Puducherry":           [11.6,  12.1,  79.6,  80.1 ],
  "Punjab":               [29.5,  32.5,  73.9,  76.8 ],
  "Rajasthan":            [23.0,  30.2,  69.5,  78.3 ],
  "Sikkim":               [27.1,  28.1,  88.0,  88.9 ],
  "Tamil Nadu":           [8.1,   13.6,  76.2,  80.3 ],
  "Telangana":            [15.8,  19.9,  77.2,  81.3 ],
  "Tripura":              [22.9,  24.5,  91.2,  92.3 ],
  "Uttar Pradesh":        [23.9,  30.4,  77.1,  84.7 ],
  "Uttarakhand":          [28.7,  31.5,  77.6,  81.0 ],
  "West Bengal":          [21.6,  27.2,  85.8,  89.9 ],
};

export async function collectReport(period: PeriodType): Promise<EnvironmentReport> {
  const [ogdMap, firmsRows, stateUvValues] = await Promise.all([
    fetchOgdAqi(),
    fetchFirmsRows(period),
    Promise.all(STATE_DEFS.map(s => fetchUvForCoord(s.lat, s.lon))),
  ]);

  const hasOgd = ogdMap.size > 0;
  const hasFirms = firmsRows.length > 0;
  const periodDaysMult = periodDays(period);

  const states: StateMetrics[] = STATE_DEFS.map((s, idx) => {
    const bbox = STATE_BBOX[s.name];
    const stateUv = stateUvValues[idx] ?? estimateUvByLatAndMonth(s.lat);

    const aqiFromOgd = hasOgd ? ogdMap.get(s.name.toLowerCase()) : undefined;
    const aqi: number = aqiFromOgd ?? estimateAqiForState(s.industrial, s.density);

    const hotspots = hasFirms && bbox
      ? countHotspotsInBbox(firmsRows, bbox[0], bbox[1], bbox[2], bbox[3])
      : Math.round(estimateStateHotspots(s.industrial, s.density) * periodDaysMult);

    const noise = calcNoise(s.industrial, s.density);

    return {
      name: s.name,
      aqi,
      aqiLabel: aqiLabel(aqi),
      thermalHotspots: hotspots,
      uvIndex: stateUv,
      uvLabel: uvLabel(stateUv),
      noiseDb: noise,
      noiseLabel: noiseLabel(noise),
    };
  });

  const indiaAqi = Math.round(states.reduce((sum, s) => sum + s.aqi, 0) / states.length);
  const totalHotspots = states.reduce((sum, s) => sum + s.thermalHotspots, 0);
  const avgNoise = Math.round(states.reduce((sum, s) => sum + s.noiseDb, 0) / states.length);
  const avgUvIndia = Math.round((states.reduce((sum, s) => sum + s.uvIndex, 0) / states.length) * 10) / 10;

  return {
    period,
    generatedAt: new Date(),
    india: {
      avgAqi: indiaAqi,
      aqiLabel: aqiLabel(indiaAqi),
      totalHotspots,
      uvIndex: avgUvIndia,
      uvLabel: uvLabel(avgUvIndia),
      avgNoise,
      noiseLabel: noiseLabel(avgNoise),
    },
    states,
  };
}
