import { useState, useRef, useCallback, useEffect, useMemo, memo } from "react";
import { Link, useLocation } from "wouter";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
// leaflet.heat is loaded via deferred CDN script in index.html
import { AuthManager } from "@/lib/auth";
import {
  Wind, ThermometerSun, Sun, Waves, ChevronUp, LogOut, ChevronDown,
  Building2, Search,
} from "lucide-react";

/* ─── State / Region Data ─────────────────────────────────────── */

interface StateData {
  id: string; key: string; name: string; label: string;
  lat: number; lon: number; zoom: number;
  aqi: number; industrial: number; density: number; noise: number;
  bbox: [number, number, number, number]; // [latMin, latMax, lonMin, lonMax]
}

function calcNoise(industrial: number, density: number): number {
  return Math.round(40 + industrial * 0.35 + Math.min(Math.log10(density + 1) * 6, 25));
}

function getNoiseStatus(db: number): string {
  if (db < 50) return "Ambient";
  if (db < 60) return "Low";
  if (db < 70) return "Moderate";
  if (db < 80) return "Elevated";
  if (db < 90) return "High";
  return "Critical";
}

const RAW_STATES = [
  { id: "IN-AN", name: "Andaman & Nicobar",   lat: 11.7401, lon: 92.6586, zoom: 9,  aqi: 42,  industrial: 15, density: 46,    bbox: [6.75, 13.7,  92.2, 93.9 ] as [number,number,number,number] },
  { id: "IN-AP", name: "Andhra Pradesh",        lat: 15.9129, lon: 79.7400, zoom: 7,  aqi: 78,  industrial: 65, density: 304,   bbox: [12.6, 19.9,  76.7, 84.8 ] as [number,number,number,number] },
  { id: "IN-AR", name: "Arunachal Pradesh",     lat: 28.2180, lon: 94.7278, zoom: 7,  aqi: 35,  industrial: 10, density: 17,    bbox: [26.6, 29.5,  91.5, 97.4 ] as [number,number,number,number] },
  { id: "IN-AS", name: "Assam",                 lat: 26.2006, lon: 92.9376, zoom: 7,  aqi: 85,  industrial: 40, density: 398,   bbox: [24.1, 28.2,  89.7, 96.0 ] as [number,number,number,number] },
  { id: "IN-BR", name: "Bihar",                 lat: 25.0961, lon: 85.3131, zoom: 7,  aqi: 180, industrial: 35, density: 1106,  bbox: [24.3, 27.5,  83.3, 88.3 ] as [number,number,number,number] },
  { id: "IN-CH", name: "Chandigarh",            lat: 30.7333, lon: 76.7794, zoom: 12, aqi: 110, industrial: 50, density: 9258,  bbox: [30.6, 30.9,  76.6, 76.9 ] as [number,number,number,number] },
  { id: "IN-CT", name: "Chhattisgarh",          lat: 21.2787, lon: 81.8661, zoom: 7,  aqi: 120, industrial: 85, density: 189,   bbox: [17.7, 24.1,  80.2, 84.4 ] as [number,number,number,number] },
  { id: "IN-DN", name: "Dadra & Nagar Haveli",  lat: 20.1809, lon: 73.0169, zoom: 10, aqi: 95,  industrial: 70, density: 700,   bbox: [20.0, 20.4,  72.8, 73.3 ] as [number,number,number,number] },
  { id: "IN-DD", name: "Daman & Diu",           lat: 20.4283, lon: 72.8397, zoom: 11, aqi: 92,  industrial: 75, density: 2191,  bbox: [20.3, 20.6,  72.7, 73.0 ] as [number,number,number,number] },
  { id: "IN-DL", name: "Delhi",                 lat: 28.6139, lon: 77.2090, zoom: 11, aqi: 245, industrial: 80, density: 11320, bbox: [28.4, 28.9,  76.8, 77.4 ] as [number,number,number,number] },
  { id: "IN-GA", name: "Goa",                   lat: 15.2993, lon: 74.1240, zoom: 9,  aqi: 55,  industrial: 30, density: 394,   bbox: [14.9, 15.8,  73.7, 74.4 ] as [number,number,number,number] },
  { id: "IN-GJ", name: "Gujarat",               lat: 22.2587, lon: 71.1924, zoom: 7,  aqi: 115, industrial: 95, density: 308,   bbox: [20.1, 24.7,  68.2, 74.5 ] as [number,number,number,number] },
  { id: "IN-HR", name: "Haryana",               lat: 29.0588, lon: 76.0856, zoom: 8,  aqi: 195, industrial: 88, density: 573,   bbox: [27.6, 30.9,  74.5, 77.6 ] as [number,number,number,number] },
  { id: "IN-HP", name: "Himachal Pradesh",      lat: 31.1048, lon: 77.1734, zoom: 8,  aqi: 65,  industrial: 45, density: 123,   bbox: [30.2, 33.3,  75.6, 79.0 ] as [number,number,number,number] },
  { id: "IN-JK", name: "Jammu & Kashmir",       lat: 33.7782, lon: 76.5762, zoom: 7,  aqi: 75,  industrial: 25, density: 56,    bbox: [32.3, 36.6,  73.7, 80.4 ] as [number,number,number,number] },
  { id: "IN-JH", name: "Jharkhand",             lat: 23.6102, lon: 85.2799, zoom: 7,  aqi: 130, industrial: 92, density: 414,   bbox: [21.9, 25.3,  83.3, 87.9 ] as [number,number,number,number] },
  { id: "IN-KA", name: "Karnataka",             lat: 15.3173, lon: 75.7139, zoom: 7,  aqi: 82,  industrial: 78, density: 319,   bbox: [11.6, 18.4,  74.0, 78.6 ] as [number,number,number,number] },
  { id: "IN-KL", name: "Kerala",                lat: 10.8505, lon: 76.2711, zoom: 7,  aqi: 50,  industrial: 40, density: 860,   bbox: [8.3,  12.8,  74.9, 77.4 ] as [number,number,number,number] },
  { id: "IN-LA", name: "Ladakh",                lat: 34.1526, lon: 77.5771, zoom: 7,  aqi: 30,  industrial: 5,  density: 3,     bbox: [32.0, 36.2,  76.3, 80.4 ] as [number,number,number,number] },
  { id: "IN-LD", name: "Lakshadweep",           lat: 10.5667, lon: 72.6417, zoom: 10, aqi: 38,  industrial: 2,  density: 2149,  bbox: [8.0,  12.5,  71.8, 74.1 ] as [number,number,number,number] },
  { id: "IN-MP", name: "Madhya Pradesh",        lat: 22.9734, lon: 78.6569, zoom: 7,  aqi: 110, industrial: 60, density: 236,   bbox: [21.1, 26.9,  74.0, 82.8 ] as [number,number,number,number] },
  { id: "IN-MH", name: "Maharashtra",           lat: 19.7515, lon: 75.7139, zoom: 7,  aqi: 125, industrial: 98, density: 365,   bbox: [15.6, 22.0,  72.6, 80.9 ] as [number,number,number,number] },
  { id: "IN-MN", name: "Manipur",               lat: 24.6637, lon: 93.9063, zoom: 8,  aqi: 60,  industrial: 12, density: 115,   bbox: [23.8, 25.7,  93.0, 94.8 ] as [number,number,number,number] },
  { id: "IN-ML", name: "Meghalaya",             lat: 25.4670, lon: 91.3662, zoom: 8,  aqi: 52,  industrial: 18, density: 132,   bbox: [25.0, 26.1,  89.8, 92.8 ] as [number,number,number,number] },
  { id: "IN-MZ", name: "Mizoram",               lat: 23.1645, lon: 92.9376, zoom: 8,  aqi: 45,  industrial: 8,  density: 52,    bbox: [21.9, 24.5,  92.3, 93.5 ] as [number,number,number,number] },
  { id: "IN-NL", name: "Nagaland",              lat: 26.1584, lon: 94.5624, zoom: 8,  aqi: 58,  industrial: 10, density: 119,   bbox: [25.2, 27.0,  93.3, 95.2 ] as [number,number,number,number] },
  { id: "IN-OR", name: "Odisha",                lat: 20.9517, lon: 85.0985, zoom: 7,  aqi: 95,  industrial: 82, density: 270,   bbox: [17.8, 22.6,  81.4, 87.4 ] as [number,number,number,number] },
  { id: "IN-PY", name: "Puducherry",            lat: 11.9416, lon: 79.8083, zoom: 11, aqi: 62,  industrial: 35, density: 2547,  bbox: [11.7, 12.1,  79.6, 80.0 ] as [number,number,number,number] },
  { id: "IN-PB", name: "Punjab",                lat: 31.1471, lon: 75.3412, zoom: 7,  aqi: 165, industrial: 70, density: 551,   bbox: [29.5, 32.5,  73.9, 76.9 ] as [number,number,number,number] },
  { id: "IN-RJ", name: "Rajasthan",             lat: 27.0238, lon: 74.2179, zoom: 7,  aqi: 140, industrial: 65, density: 200,   bbox: [23.1, 30.2,  69.5, 78.3 ] as [number,number,number,number] },
  { id: "IN-SK", name: "Sikkim",                lat: 27.5330, lon: 88.5122, zoom: 9,  aqi: 40,  industrial: 15, density: 86,    bbox: [27.1, 28.1,  88.0, 88.9 ] as [number,number,number,number] },
  { id: "IN-TN", name: "Tamil Nadu",            lat: 11.1271, lon: 78.6569, zoom: 7,  aqi: 88,  industrial: 90, density: 555,   bbox: [8.1,  13.6,  76.2, 80.4 ] as [number,number,number,number] },
  { id: "IN-TG", name: "Telangana",             lat: 18.1124, lon: 79.0193, zoom: 8,  aqi: 90,  industrial: 75, density: 312,   bbox: [15.8, 19.9,  77.3, 81.3 ] as [number,number,number,number] },
  { id: "IN-TR", name: "Tripura",               lat: 23.9408, lon: 91.9882, zoom: 8,  aqi: 72,  industrial: 20, density: 350,   bbox: [22.9, 24.5,  91.2, 92.3 ] as [number,number,number,number] },
  { id: "IN-UP", name: "Uttar Pradesh",         lat: 26.8467, lon: 80.9462, zoom: 7,  aqi: 210, industrial: 75, density: 829,   bbox: [23.9, 30.4,  77.1, 84.7 ] as [number,number,number,number] },
  { id: "IN-UT", name: "Uttarakhand",           lat: 30.0668, lon: 79.0193, zoom: 8,  aqi: 80,  industrial: 40, density: 189,   bbox: [28.7, 31.5,  77.6, 81.1 ] as [number,number,number,number] },
  { id: "IN-WB", name: "West Bengal",           lat: 22.9868, lon: 87.8550, zoom: 7,  aqi: 155, industrial: 88, density: 1028,  bbox: [21.6, 27.2,  85.8, 89.9 ] as [number,number,number,number] },
];

const ALL_STATES: StateData[] = RAW_STATES.map(s => ({
  ...s, key: s.id,
  label: s.name.toUpperCase().replace(/ /g, "_"),
  noise: calcNoise(s.industrial, s.density),
}));

const NATIONAL_REGION: StateData = {
  id: "IN", key: "national", name: "India (National)", label: "INDIA_NATIONAL",
  lat: 22.5937, lon: 78.9629, zoom: 5,
  aqi: 130, industrial: 65, density: 419, noise: calcNoise(65, 419),
  bbox: [8.0, 37.6, 68.0, 97.4],
};

/* ─── Threat Level ────────────────────────────────────────────── */

function getThreatLevel(region: StateData, overlayValues: Record<string, { value: string; status: string }>) {
  let score = 0;

  const aqi = region.aqi;
  if (aqi > 200) score = Math.max(score, 4);
  else if (aqi > 150) score = Math.max(score, 3);
  else if (aqi > 100) score = Math.max(score, 2);
  else if (aqi > 50)  score = Math.max(score, 1);

  const noise = region.noise;
  if (noise >= 90) score = Math.max(score, 4);
  else if (noise >= 80) score = Math.max(score, 3);
  else if (noise >= 70) score = Math.max(score, 2);
  else if (noise >= 60) score = Math.max(score, 1);

  const uvVal = parseFloat(overlayValues.uv?.value);
  if (!isNaN(uvVal)) {
    if (uvVal > 8) score = Math.max(score, 4);
    else if (uvVal > 6) score = Math.max(score, 3);
    else if (uvVal > 3) score = Math.max(score, 2);
    else score = Math.max(score, 1);
  }

  const tempVal = parseFloat(overlayValues.temp?.value);
  if (!isNaN(tempVal)) {
    if (tempVal > 45) score = Math.max(score, 4);
    else if (tempVal > 38) score = Math.max(score, 3);
    else if (tempVal > 32) score = Math.max(score, 2);
  }

  if (score >= 4) return { label: "CRITICAL", color: "#ef4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.25)" };
  if (score >= 3) return { label: "HIGH",     color: "#f97316", bg: "rgba(249,115,22,0.08)", border: "rgba(249,115,22,0.25)" };
  if (score >= 2) return { label: "MODERATE", color: "#facc15", bg: "rgba(250,204,21,0.08)", border: "rgba(250,204,21,0.25)" };
  if (score >= 1) return { label: "LOW",      color: "#10b981", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)"  };
  return              { label: "MINIMAL",  color: "#38bdf8", bg: "rgba(56,189,248,0.08)",  border: "rgba(56,189,248,0.2)"  };
}

/* ─── Overlay config ─────────────────────────────────────────── */

type OverlayType = "air" | "temp" | "uv" | "noise" | null;

interface OverlayData {
  value: string; status: string; color: string; unit: string;
  min: number; max: number; title: string; subtitle: string; icon: React.ReactNode;
}

function getOverlayConfig(noiseVal: string): Record<string, OverlayData> {
  return {
    air:   { title: "Air Quality",    subtitle: "Atmospheric PM2.5 Grid",  value: "--",     status: "Scanning",                    color: "#10b981", unit: "AQI", min: 0,  max: 300, icon: <Wind className="w-5 h-5" /> },
    temp:  { title: "Thermal Hotspots", subtitle: "NASA FIRMS Fire Detection",  value: "--",     status: "Scanning",                    color: "#f97316", unit: "🔥",  min: 0,  max: 50,  icon: <ThermometerSun className="w-5 h-5" /> },
    uv:    { title: "UV Intensity",   subtitle: "Ultraviolet Solar Flux",  value: "--",     status: "Scanning",                    color: "#facc15", unit: "UVI", min: 0,  max: 12,  icon: <Sun className="w-5 h-5" /> },
    noise: { title: "Acoustic Intel", subtitle: "Urban Noise Pollution",   value: noiseVal, status: getNoiseStatus(Number(noiseVal)), color: "#a855f7", unit: "dB",  min: 30, max: 110, icon: <Waves className="w-5 h-5" /> },
  };
}

function getAQIStatus(aqi: number) {
  if (aqi <= 50)  return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Sensitive Alert";
  if (aqi <= 200) return "Unhealthy";
  return "Critical";
}

/* ─── Custom Region Dropdown ─────────────────────────────────── */

const ALL_REGIONS = [NATIONAL_REGION, ...ALL_STATES];

function noiseColor(db: number): string {
  return db < 55 ? "#10b981" : db < 68 ? "#facc15" : db < 80 ? "#f97316" : "#ef4444";
}

interface RegionDropdownProps { selected: StateData; onSelect: (s: StateData) => void; onOpenChange?: (open: boolean) => void; }

const RegionDropdown = memo(function RegionDropdown({ selected, onSelect, onOpenChange }: RegionDropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onOpenChange?.(open);
  }, [open, onOpenChange]);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const searchLower = search.toLowerCase();
  const filtered = useMemo(
    () => search
      ? ALL_REGIONS.filter(s => s.name.toLowerCase().includes(searchLower) || s.id.toLowerCase().includes(searchLower))
      : ALL_REGIONS,
    [search, searchLower],
  );

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="glass-panel flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer transition-[border-color] duration-200 shadow-2xl border border-sky-400/20 hover:border-sky-400/40 min-w-[200px]"
      >
        <span className="font-mono text-[10px] font-bold uppercase tracking-tight text-white flex-1 text-left">{selected.label}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-sky-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-72 glass-panel rounded-2xl shadow-2xl z-50 overflow-hidden border border-sky-400/20"
          style={{ animation: "slideDown 0.2s cubic-bezier(0.16,1,0.3,1)" }}>
          <div className="p-3 border-b border-white/10">
            <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2 border border-white/10">
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input autoFocus value={search} onChange={e => setSearch(e.target.value)} placeholder="Search state..."
                className="bg-transparent text-white text-[11px] font-mono outline-none placeholder:text-slate-600 w-full" />
            </div>
          </div>
          <div className="max-h-72 overflow-y-auto py-1" style={{ scrollbarWidth: "thin", scrollbarColor: "#1e293b transparent" }}>
            {filtered.length === 0 && <div className="px-4 py-3 text-[11px] text-slate-500 text-center">No results</div>}
            {filtered.map(state => {
              const isActive = state.key === selected.key;
              const isNational = state.key === "national";
              return (
                <button key={state.key} onClick={() => { onSelect(state); setOpen(false); setSearch(""); }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors group ${isActive ? "bg-sky-400/15 text-sky-400" : "text-slate-300 hover:bg-white/5 hover:text-white"} ${isNational ? "border-b border-white/10 mb-1" : ""}`}>
                  <div className="flex items-center gap-2.5">
                    {isNational && <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 w-10">ALL</span>}
                    {!isNational && <span className="text-[8px] font-mono text-slate-600 w-10">{state.id}</span>}
                    <span className="text-[11px] font-bold">{state.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[9px] font-mono font-bold" style={{ color: noiseColor(state.noise) }}>{state.noise}dB</span>
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />}
                  </div>
                </button>
              );
            })}
          </div>
          <div className="px-4 py-2 border-t border-white/10 flex items-center justify-between">
            <span className="text-[9px] text-slate-600 font-mono">{ALL_STATES.length + 1} JURISDICTIONS</span>
            <div className="flex items-center gap-2 text-[9px] font-mono">
              <span className="text-emerald-400">■</span><span className="text-slate-500">Low</span>
              <span className="text-yellow-400">■</span><span className="text-slate-500">Mod</span>
              <span className="text-red-400">■</span><span className="text-slate-500">High</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

/* ─── Map Controller ─────────────────────────────────────────── */

interface MapControllerProps {
  currentOverlay: OverlayType;
  noiseValue: string;
  overlayValues: Record<string, { value: string; status: string }>;
  setOverlayValues: (fn: (prev: Record<string, { value: string; status: string }>) => Record<string, { value: string; status: string }>) => void;
  jumpTarget: { lat: number; lon: number; zoom: number } | null;
  setJumpTarget: (t: null) => void;
  regionBbox: [number, number, number, number]; // [latMin, latMax, lonMin, lonMax]
  anchorPoints: { lat: number; lon: number }[];
}

function MapController({ currentOverlay, noiseValue, overlayValues, setOverlayValues, jumpTarget, setJumpTarget, regionBbox, anchorPoints }: MapControllerProps) {
  const map = useMap();
  const heatLayerRef = useRef<L.Layer | null>(null);
  const markerGroupRef = useRef<L.LayerGroup>(L.layerGroup());
  const prevOverlay = useRef<OverlayType>(null);
  const prevNoise = useRef<string>("");
  const fetchController = useRef<AbortController | null>(null);

  useMapEvents({
    moveend: () => { if (currentOverlay && currentOverlay !== "noise") fetchData(currentOverlay, map.getCenter()); },
  });

  useEffect(() => {
    if (!jumpTarget) return;
    map.setView([jumpTarget.lat, jumpTarget.lon], jumpTarget.zoom, { animate: true });
    setJumpTarget(null);
  }, [jumpTarget, map, setJumpTarget]);

  const cleanup = useCallback(() => {
    if (heatLayerRef.current) { map.removeLayer(heatLayerRef.current); heatLayerRef.current = null; }
    markerGroupRef.current.clearLayers();
  }, [map]);

  const renderHeat = useCallback((
    type: string,
    value: string,
    color: string,
    unit: string,
    explicitPoints?: { lat: number; lon: number }[],
  ) => {
    cleanup();
    const points = explicitPoints && explicitPoints.length > 0 ? explicitPoints : anchorPoints;
    const pts: [number, number, number][] = [];
    markerGroupRef.current.addTo(map);

    for (const anchor of points) {
      pts.push([anchor.lat, anchor.lon, 0.4 + Math.random() * 0.6]);
      const icon = L.divIcon({
        className: "",
        html: `<div style="font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:800;padding:2px 6px;border-radius:5px;background:rgba(2,6,23,0.92);border:1px solid ${color};color:${color};white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.6);letter-spacing:0.03em;">${value}${unit}</div>`,
      });
      L.marker([anchor.lat, anchor.lon], { icon }).addTo(markerGroupRef.current);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((L as any).heatLayer) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      heatLayerRef.current = (L as any).heatLayer(pts, {
        radius: 55, blur: 40,
        gradient: { 0.2: color + "11", 0.5: color + "66", 1.0: color },
      });
      heatLayerRef.current!.addTo(map);
    }
  }, [map, cleanup, anchorPoints]);

  const fetchData = useCallback(async (type: string, center: L.LatLng) => {
    if (fetchController.current) fetchController.current.abort();
    fetchController.current = new AbortController();
    const signal = fetchController.current.signal;

    const token = AuthManager.getToken();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const cfg = getOverlayConfig(noiseValue);

    try {
      // ── Thermal: try NASA FIRMS first, fall back to Open-Meteo temperature ──
      if (type === "temp") {
        try {
          const firmsRes = await fetch("/api/thermal/fires?dayRange=7", { headers, signal });
          if (firmsRes.ok) {
            type FirmsHotspot = { latitude: number; longitude: number };
            const firmsData = await firmsRes.json() as { count: number; hotspots: FirmsHotspot[] };

            // FIRMS already returns IND-only data; apply bbox filter for state view
            const [latMin, latMax, lonMin, lonMax] = regionBbox;
            const isNational = latMax - latMin > 25; // national bbox spans >25° lat
            const relevant = isNational
              ? firmsData.hotspots
              : firmsData.hotspots.filter(h =>
                  h.latitude >= latMin && h.latitude <= latMax &&
                  h.longitude >= lonMin && h.longitude <= lonMax
                );

            // If state filter yields nothing, fall back to all hotspots as indicator
            const displayHotspots = relevant.length > 0 ? relevant : firmsData.hotspots;
            const count = relevant.length > 0 ? relevant.length : firmsData.count;

            if (count > 0) {
              const value = String(count);
              const status = count < 20 ? "Low" : count < 100 ? "Moderate" : count < 500 ? "High" : "Critical";
              setOverlayValues(prev => ({ ...prev, temp: { value, status } }));
              const pts = displayHotspots.slice(0, 80).map(h => ({ lat: h.latitude, lon: h.longitude }));
              renderHeat(type, value, cfg[type].color, "🔥", pts.length > 0 ? pts : undefined);
              return;
            }
          }
        } catch (firmsErr) {
          if ((firmsErr as Error).name === "AbortError") return;
        }
        // Fall back to Open-Meteo temperature when FIRMS not configured or returns nothing
        const tempUrl = `https://api.open-meteo.com/v1/forecast?latitude=${center.lat}&longitude=${center.lng}&current=temperature_2m&timezone=auto`;
        const tempRes = await fetch(tempUrl, { signal });
        if (tempRes.ok) {
          const data = await tempRes.json() as Record<string, unknown>;
          const cur = data.current as Record<string, unknown>;
          if (cur) {
            const t = Math.round(cur.temperature_2m as number);
            const value = String(t);
            const status = t > 38 ? "Extreme" : t > 32 ? "Elevated" : "Normal";
            setOverlayValues(prev => ({ ...prev, temp: { value, status } }));
            renderHeat(type, value, cfg[type].color, "°C");
          }
        }
        return;
      }

      // ── Air Quality ──
      if (type === "air") {
        const res = await fetch(`/api/air-quality?lat=${center.lat}&lon=${center.lng}`, { headers, signal });
        if (res.status === 401) { AuthManager.logout(); return; }
        if (!res.ok) { renderHeat(type, "--", cfg[type].color, cfg[type].unit); return; }
        const data = await res.json() as Record<string, unknown>;
        const d = data.data as Record<string, unknown>;
        if (d && typeof d.aqi === "number") {
          const aqi = d.aqi;
          const value = String(aqi);
          const status = getAQIStatus(aqi);
          setOverlayValues(prev => ({ ...prev, air: { value, status } }));
          renderHeat(type, value, cfg[type].color, cfg[type].unit);
        }
        return;
      }

      // ── UV Intensity: try OpenUV API, fall back to Open-Meteo ──
      if (type === "uv") {
        const uvHelper = async (): Promise<{ value: string; status: string } | null> => {
          // Primary: backend OpenUV proxy
          try {
            const res = await fetch(`/api/uv?lat=${center.lat}&lon=${center.lng}`, { headers, signal });
            if (res.status === 401) { AuthManager.logout(); return null; }
            if (res.ok) {
              const data = await res.json() as { result?: { uv?: number; uv_max?: number } };
              const result = data.result;
              if (result) {
                const uvCurrent = result.uv ?? 0;
                const uvMax = result.uv_max ?? uvCurrent;
                const displayUv = uvCurrent > 0 ? uvCurrent : uvMax;
                if (displayUv > 0) {
                  return {
                    value: displayUv.toFixed(1),
                    status: displayUv > 8 ? "Very High" : displayUv > 6 ? "High Risk" : displayUv > 3 ? "Moderate" : "Low",
                  };
                }
              }
            }
          } catch (e) {
            if ((e as Error).name === "AbortError") return null;
          }
          // Fallback: Open-Meteo free UV (no API key needed)
          try {
            // Use daily max UV — more meaningful than real-time (which is 0 at night/evening)
            const omUrl = `https://api.open-meteo.com/v1/forecast?latitude=${center.lat}&longitude=${center.lng}&daily=uv_index_max&timezone=Asia%2FKolkata&forecast_days=1`;
            const omRes = await fetch(omUrl, { signal });
            if (omRes.ok) {
              const omData = await omRes.json() as { daily?: { uv_index_max?: number[] } };
              const uvMax = omData.daily?.uv_index_max?.[0];
              if (typeof uvMax === "number" && uvMax > 0) {
                const displayUv = Math.round(uvMax * 10) / 10;
                return {
                  value: displayUv.toFixed(1),
                  status: displayUv > 8 ? "Very High" : displayUv > 6 ? "High Risk" : displayUv > 3 ? "Moderate" : "Low",
                };
              }
            }
          } catch (e) {
            if ((e as Error).name === "AbortError") return null;
          }
          // Last resort: seasonal + latitude estimate so we never show 0
          const month = new Date().getMonth();
          const monthlyPeak = [7, 8, 9, 10, 11, 10, 8, 8, 9, 8, 6, 6];
          const base = monthlyPeak[month] ?? 7;
          const latAdj = (20 - center.lat) * 0.08;
          const estimated = Math.round(Math.max(1, Math.min(base + latAdj, 13)) * 10) / 10;
          return {
            value: estimated.toFixed(1),
            status: estimated > 8 ? "Very High" : estimated > 6 ? "High Risk" : estimated > 3 ? "Moderate" : "Low",
          };
        };

        const uvResult = await uvHelper();
        if (uvResult) {
          setOverlayValues(prev => ({ ...prev, uv: uvResult }));
          renderHeat(type, uvResult.value, cfg[type].color, cfg[type].unit);
        }
        return;
      }
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      console.error("[SentraScope] fetch error:", e);
    }
  }, [setOverlayValues, renderHeat, noiseValue, regionBbox]);

  useEffect(() => {
    const overlayChanged = currentOverlay !== prevOverlay.current;
    const noiseChanged = currentOverlay === "noise" && noiseValue !== prevNoise.current;
    prevOverlay.current = currentOverlay;
    prevNoise.current = noiseValue;

    if (!currentOverlay) { cleanup(); return; }
    if (!overlayChanged && !noiseChanged) return;

    const cfg = getOverlayConfig(noiseValue);
    const center = map.getCenter();
    if (currentOverlay === "noise") {
      renderHeat("noise", noiseValue, cfg.noise.color, cfg.noise.unit);
    } else {
      fetchData(currentOverlay, center);
    }
  }, [currentOverlay, noiseValue, cleanup, fetchData, renderHeat, map]);

  useEffect(() => {
    markerGroupRef.current.addTo(map);
    return () => { cleanup(); };
  }, [map, cleanup]);

  return null;
}

/* ─── Main Dashboard ─────────────────────────────────────────── */

const LAYER_KEYS = ["air", "temp", "uv", "noise"] as const;

export function Dashboard() {
  const [, navigate] = useLocation();
  const [selectedRegion, setSelectedRegion] = useState<StateData>(NATIONAL_REGION);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentOverlay, setCurrentOverlay] = useState<OverlayType>(null);
  const [overlayValues, setOverlayValues] = useState<Record<string, { value: string; status: string }>>({
    air:   { value: "--", status: "Scanning" },
    temp:  { value: "--", status: "Scanning" },
    uv:    { value: "--", status: "Scanning" },
    noise: { value: String(NATIONAL_REGION.noise), status: getNoiseStatus(NATIONAL_REGION.noise) },
  });
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [jumpTarget, setJumpTarget] = useState<{ lat: number; lon: number; zoom: number } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const session = AuthManager.getSession();
  const username = session?.user?.name?.toUpperCase() || "OPERATOR";
  const noiseValue = String(selectedRegion.noise);

  const anchorPoints = useMemo(() => {
    if (selectedRegion.key === "national") {
      return ALL_STATES.map(s => ({ lat: s.lat, lon: s.lon }));
    }
    const { lat, lon, bbox, key } = selectedRegion;
    const [latMin, latMax, lonMin, lonMax] = bbox;
    const latRange = latMax - latMin;
    const lonRange = lonMax - lonMin;
    // Deterministic seeded pseudo-random so points are stable per region
    // and don't re-randomize on every memoized recompute
    const seed = key.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    const seededRand = (n: number) => { const x = Math.sin(seed + n + 1) * 10000; return x - Math.floor(x); };
    const pts: { lat: number; lon: number }[] = [{ lat, lon }];
    for (let i = 0; i < 6; i++) {
      pts.push({
        lat: Math.min(latMax - 0.05, Math.max(latMin + 0.05, lat + (seededRand(i * 2) - 0.5) * latRange * 0.5)),
        lon: Math.min(lonMax - 0.05, Math.max(lonMin + 0.05, lon + (seededRand(i * 2 + 1) - 0.5) * lonRange * 0.5)),
      });
    }
    return pts;
  }, [selectedRegion]);

  const handleRegionSelect = useCallback((state: StateData) => {
    setSelectedRegion(state);
    setJumpTarget({ lat: state.lat, lon: state.lon, zoom: state.zoom });
    setOverlayValues(prev => ({ ...prev, noise: { value: String(state.noise), status: getNoiseStatus(state.noise) } }));
  }, []);

  const toggleOverlay = useCallback((type: OverlayType) => setCurrentOverlay(prev => prev === type ? null : type), []);

  const terminateSession = useCallback(() => { AuthManager.logout(); navigate("/login"); }, [navigate]);

  /* Keyboard shortcuts: 1-4 toggle layers, Esc closes */
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "1") toggleOverlay("air");
      else if (e.key === "2") toggleOverlay("temp");
      else if (e.key === "3") toggleOverlay("uv");
      else if (e.key === "4") toggleOverlay("noise");
      else if (e.key === "Escape") setCurrentOverlay(null);
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [toggleOverlay]);

  const OVERLAY_CONFIG = useMemo(() => getOverlayConfig(noiseValue), [noiseValue]);
  const activeConfig = currentOverlay ? OVERLAY_CONFIG[currentOverlay] : null;
  const activeValues = currentOverlay ? overlayValues[currentOverlay] : null;
  const threat = useMemo(() => getThreatLevel(selectedRegion, overlayValues), [selectedRegion, overlayValues]);

  const layers = useMemo(() => [
    { id: "air",   label: "AQI Monitoring",  sub: "Atmosphere", icon: <Wind className="w-5 h-5" />,           colorCls: "bg-emerald-500/10 text-emerald-400", shortcut: "1" },
    { id: "temp",  label: "Thermal Hotspots", sub: "FIRMS/NASA", icon: <ThermometerSun className="w-5 h-5" />, colorCls: "bg-orange-500/10 text-orange-400",   shortcut: "2" },
    { id: "uv",    label: "UV Intensity",     sub: "Radiation",  icon: <Sun className="w-5 h-5" />,            colorCls: "bg-yellow-500/10 text-yellow-400",   shortcut: "3" },
    { id: "noise", label: "Noise Hotspots",   sub: "Acoustic",   icon: <Waves className="w-5 h-5" />,          colorCls: "bg-purple-500/10 text-purple-400",   shortcut: "4" },
  ] as const, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#020617]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <MapContainer
        center={[NATIONAL_REGION.lat, NATIONAL_REGION.lon]}
        zoom={NATIONAL_REGION.zoom}
        zoomControl={false}
        attributionControl={false}
        style={{ height: "100vh", width: "100vw", zIndex: 0, filter: "grayscale(1) invert(0.9) contrast(1.1) brightness(0.8)" }}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
        <MapController
          currentOverlay={currentOverlay}
          noiseValue={noiseValue}
          overlayValues={overlayValues}
          setOverlayValues={setOverlayValues}
          jumpTarget={jumpTarget}
          setJumpTarget={setJumpTarget}
          regionBbox={selectedRegion.bbox}
          anchorPoints={anchorPoints}
        />
      </MapContainer>

      {/* ── TOP BAR ── */}
      <div className="fixed top-3 sm:top-5 left-3 sm:left-5 right-3 sm:right-5 z-20 pointer-events-none">
        <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 shadow-2xl"
          style={{ background: "rgba(2,6,23,0.82)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.08)" }}>

          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 no-underline shrink-0">
            <img src="/logo.svg" alt="SentraScope" className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover" />
            <span className="text-xs sm:text-sm font-black tracking-tight text-white uppercase hidden sm:block">SentraScope</span>
          </Link>

          <div className="w-px h-5 bg-white/10 mx-0.5 sm:mx-1 shrink-0" />

          <nav className="hidden sm:flex items-center gap-0.5 flex-1">
            {[{ href: "/dashboard", label: "Home" }, { href: "/alerts", label: "Alerts" }, { href: "/profile", label: "Profile" }].map(l => (
              <Link key={l.href} href={l.href}
                className="px-2.5 sm:px-3.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-white hover:bg-white/5 rounded-lg transition-[color,background-color] duration-150 no-underline whitespace-nowrap">
                {l.label}
              </Link>
            ))}
            <div className="w-px h-4 bg-white/10 mx-1 sm:mx-2 shrink-0" />
            <Link href="/urbanization"
              className="px-2.5 sm:px-3 py-1.5 text-[10px] font-bold flex items-center gap-1.5 rounded-lg transition-[background-color] duration-150 no-underline hover:bg-red-500/10 whitespace-nowrap"
              style={{ color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }}>
              <Building2 className="w-3 h-3 shrink-0" />
              <span className="hidden lg:inline">Urbanisation</span>
            </Link>
          </nav>

          <div className="flex-1 sm:hidden" />

          {/* Live indicator */}
          <div className="flex items-center gap-1.5 shrink-0 px-2.5 sm:px-3 py-1.5 rounded-lg"
            style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)" }}>
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse inline-block" />
            <span className="text-[9px] font-bold font-mono text-emerald-400 uppercase tracking-wide hidden xs:inline">Live</span>
          </div>

          {/* Threat level badge */}
          <div className="flex items-center gap-1.5 shrink-0 px-2.5 sm:px-3 py-1.5 rounded-lg"
            style={{ background: threat.bg, border: `1px solid ${threat.border}` }}>
            <span className="w-1.5 h-1.5 rounded-full inline-block animate-pulse" style={{ backgroundColor: threat.color }} />
            <span className="text-[9px] font-bold font-mono uppercase tracking-wide hidden sm:inline" style={{ color: threat.color }}>
              THREAT: {threat.label}
            </span>
          </div>

          <div className="w-px h-5 bg-white/10 mx-0.5 sm:mx-1 shrink-0" />

          <RegionDropdown selected={selectedRegion} onSelect={handleRegionSelect} onOpenChange={setDropdownOpen} />

          <button onClick={() => setSidebarOpen(o => !o)}
            className="md:hidden ml-1 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors shrink-0">
            {sidebarOpen
              ? <ChevronDown className="w-4 h-4 rotate-90" />
              : <ChevronDown className="w-4 h-4 -rotate-90" />}
          </button>
        </div>
      </div>

      {/* ── LEFT SIDEBAR ── */}
      {sidebarOpen && <div className="md:hidden fixed inset-0 z-[19] bg-black/50" onClick={() => setSidebarOpen(false)} />}

      <div className={`
        fixed top-[72px] sm:top-[80px] bottom-0 w-72 flex flex-col gap-2 z-[21] overflow-y-auto
        transition-transform duration-300 ease-in-out
        md:left-5 md:bottom-24 md:top-[88px] md:translate-x-0 md:pb-0
        ${sidebarOpen ? "left-3 translate-x-0 pb-24" : "-translate-x-full left-3 md:translate-x-0"}
      `} style={{ scrollbarWidth: "thin", scrollbarColor: "#1e293b transparent" }}>
        <div className="glass-panel rounded-2xl p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between px-1 mb-1">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Intelligence Layers</h2>
            <span className="text-[8px] font-mono text-slate-600">USE KEYS [1]–[4]</span>
          </div>

          {/* Selected Region Info Card */}
          <div className="p-3 rounded-xl mb-1 border border-sky-400/10 bg-white/5">
            <p className="text-[8px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1.5">Active Jurisdiction</p>
            <p className="text-sm font-bold text-white leading-tight">{selectedRegion.name}</p>
            <div className="flex gap-3 mt-2">
              <div><p className="text-[8px] text-slate-500 uppercase tracking-wider">AQI Index</p>
                <p className="text-[11px] font-mono font-bold text-emerald-400">{selectedRegion.aqi}</p></div>
              <div><p className="text-[8px] text-slate-500 uppercase tracking-wider">Noise Est.</p>
                <p className="text-[11px] font-mono font-bold text-purple-400">{selectedRegion.noise} dB</p></div>
              <div><p className="text-[8px] text-slate-500 uppercase tracking-wider">Industrial</p>
                <p className="text-[11px] font-mono font-bold text-orange-400">{selectedRegion.industrial}%</p></div>
            </div>
          </div>

          {/* Layer Toggles with keyboard hints */}
          {layers.map(layer => (
            <button key={layer.id}
              onClick={() => { toggleOverlay(layer.id as OverlayType); setSidebarOpen(false); }}
              className={`p-3.5 rounded-xl text-left transition-[transform,background-color,border-color] duration-300 cursor-pointer border-l-[3px] hover:bg-white/5 ${currentOverlay === layer.id ? "bg-sky-400/10 border-l-sky-400 translate-x-1" : "border-l-transparent bg-white/[0.02]"}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${layer.colorCls}`}>{layer.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">{layer.sub}</p>
                  <p className="text-sm font-bold text-white">{layer.label}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-[8px] font-mono px-1.5 py-0.5 rounded border border-white/10 text-slate-500 bg-white/5">[{layer.shortcut}]</span>
                  {layer.id === "noise" && (
                    <span className="text-[9px] font-mono font-bold text-purple-400">{selectedRegion.noise}dB</span>
                  )}
                </div>
              </div>
            </button>
          ))}

        </div>
      </div>

      {/* ── BOTTOM LEFT: User Badge ── */}
      <div className="fixed bottom-3 sm:bottom-5 left-3 sm:left-5 z-30">
        {logoutOpen && (
          <div className="absolute bottom-full left-0 mb-3 w-56 glass-panel rounded-xl py-2 shadow-2xl overflow-hidden"
            style={{ animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}>
            <div className="px-4 py-2 border-b border-white/10 mb-1">
              <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Session Control</p>
            </div>
            <button onClick={terminateSession}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors bg-transparent border-none cursor-pointer">
              <LogOut className="w-4 h-4" /> Terminate Session
            </button>
          </div>
        )}
        <div onClick={() => setLogoutOpen(o => !o)}
          className="glass-panel flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-xl cursor-pointer hover:border-sky-400/40 transition-[border-color] duration-200 shadow-2xl border border-white/5">
          <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-full bg-sky-500/20 flex items-center justify-center border border-sky-500/30 shrink-0">
            <img src="/logo.svg" alt="" className="w-4 sm:w-5 h-4 sm:h-5 rounded-full object-cover opacity-80" />
          </div>
          <div className="hidden sm:block">
            <p className="text-[9px] uppercase font-black tracking-tighter text-slate-500 leading-none">Identity Verified</p>
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold text-white font-mono">{username}</p>
              <ChevronUp className="w-3 h-3 text-slate-500" />
            </div>
          </div>
        </div>
      </div>

      {/* ── SCALE BAR ── */}
      {activeConfig && (
        <div className="hidden md:block fixed bottom-5 z-20 glass-panel shadow-2xl"
          style={{ left: "300px", width: "260px", padding: "12px 16px", borderRadius: "12px" }}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Layer Intensity</span>
            <span className="text-[9px] font-mono font-bold" style={{ color: activeConfig.color }}>{activeConfig.unit}</span>
          </div>
          <div className="h-2 w-full rounded-md my-2.5"
            style={{ background: `linear-gradient(to right, #0f172a, ${activeConfig.color})`, boxShadow: "inset 0 0 10px rgba(0,0,0,0.5)" }} />
          <div className="flex justify-between text-[10px] font-mono font-bold text-slate-300">
            <div className="flex flex-col"><span>{activeConfig.min}</span><span className="text-[8px] text-slate-500 font-normal">MIN</span></div>
            <div className="flex flex-col items-end"><span>{activeConfig.max}</span><span className="text-[8px] text-slate-500 font-normal">MAX</span></div>
          </div>
        </div>
      )}

      {/* ── DATA OVERLAY PANEL — Desktop right panel ── */}
      {activeConfig && activeValues && (
        <div className="hidden md:block fixed right-5 top-[88px] w-80 z-20">
          <div className="glass-panel p-6 rounded-2xl shadow-2xl transition-[opacity,transform] duration-500"
            style={{ animation: "slideUp 0.35s cubic-bezier(0.16,1,0.3,1)" }}>
            <OverlayPanelContent activeConfig={activeConfig} activeValues={activeValues} selectedRegion={selectedRegion} />
          </div>
        </div>
      )}

      {/* ── INFO BOX — bottom right when no overlay active ── */}
      {!activeConfig && (
        <div className="hidden md:block fixed right-5 bottom-5 w-72 z-20 transition-[opacity] duration-200"
          style={{ opacity: dropdownOpen ? 0 : 0.55, pointerEvents: dropdownOpen ? "none" : "auto" }}>
          <div className="glass-panel p-5 rounded-2xl shadow-2xl">
            <div className="flex flex-col items-center justify-center py-4 gap-3">
              <div className="w-10 h-10 rounded-full border border-sky-400/20 flex items-center justify-center">
                <div className="w-5 h-5 rounded-full border border-sky-400/30 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-sky-400/40" />
                </div>
              </div>
              <div className="text-center">
                <p className="font-mono text-[10px] text-sky-400/60 tracking-[0.15em] leading-relaxed">
                  &gt;_ SELECT AN INTELLIGENCE<br />LAYER TO BEGIN
                </p>
                <p className="font-mono text-[9px] text-slate-700 mt-2 tracking-wider">
                  KEYS [1] [2] [3] [4] TO ACTIVATE
                </p>
                <p className="font-mono text-[9px] text-slate-700 tracking-wider">
                  [ESC] TO DEACTIVATE
                </p>
              </div>
              <div className="flex gap-2">
                {LAYER_KEYS.map((k, i) => (
                  <div key={k} className="w-7 h-7 rounded border border-white/10 bg-white/[0.03] flex items-center justify-center">
                    <span className="text-[9px] font-mono text-slate-600">{i + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile bottom sheet ── */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 z-[22] glass-panel rounded-t-2xl transition-transform duration-500 ${activeConfig ? "translate-y-0 pointer-events-auto" : "translate-y-full pointer-events-none"}`}
        style={{ maxHeight: "55vh", overflowY: "auto" }}>
        {activeConfig && activeValues && (
          <div className="p-4">
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4" />
            <OverlayPanelContent activeConfig={activeConfig} activeValues={activeValues} selectedRegion={selectedRegion} compact />
          </div>
        )}
      </div>

    </div>
  );
}

/* ─── Shared overlay panel content ──────────────────────────── */

interface OverlayPanelContentProps {
  activeConfig: OverlayData;
  activeValues: { value: string; status: string };
  selectedRegion: StateData;
  compact?: boolean;
}

const OverlayPanelContent = memo(function OverlayPanelContent({ activeConfig, activeValues, selectedRegion, compact }: OverlayPanelContentProps) {
  const sparkPoints = useMemo(() => {
    const baseVal = activeValues.value !== "--" ? Number(activeValues.value) : 50;
    const pts = Array.from({ length: 15 }, (_, i) => baseVal * (0.85 + ((i * 7919) % 100) / 333));
    const max = Math.max(...pts);
    const min = Math.min(...pts);
    const range = max - min || 1;
    return pts.map((v, i) => `${(i / 14) * 280},${80 - ((v - min) / range) * 70}`).join(" ");
  }, [activeValues.value]);

  return (
    <>
      <div className="flex justify-between items-start mb-1">
        <h3 className={`${compact ? "text-base" : "text-lg"} font-bold tracking-tight text-white`}>{activeConfig.title}</h3>
        <span style={{ color: activeConfig.color }}>{activeConfig.icon}</span>
      </div>
      <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-3">{activeConfig.subtitle}</p>

      <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider">Jurisdiction:</span>
        <span className="text-[10px] font-bold text-sky-400 font-mono">{selectedRegion.id}</span>
        <span className="text-[10px] text-white font-medium truncate">{selectedRegion.name}</span>
      </div>

      <div className="flex items-center gap-4 mb-4 sm:mb-6">
        <span className={`${compact ? "text-4xl" : "text-5xl"} font-black font-mono tracking-tighter text-white`}>{activeValues.value}</span>
        <div className="h-10 w-px bg-slate-800" />
        <div>
          <p className="text-sm font-bold uppercase tracking-wide" style={{ color: activeConfig.color }}>{activeValues.status}</p>
          <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Regional Baseline</p>
        </div>
      </div>

      {!compact && (
        <svg className="w-full h-20 mb-4" viewBox="0 0 280 80" preserveAspectRatio="none">
          <polyline points={sparkPoints} fill="none" stroke={activeConfig.color} strokeWidth="2" />
          <polygon points={`0,80 ${sparkPoints} 280,80`} fill={activeConfig.color} fillOpacity="0.06" />
        </svg>
      )}
    </>
  );
});
