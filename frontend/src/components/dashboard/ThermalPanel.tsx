import { Flame, ActivitySquare, AlertOctagon, Map as MapIcon } from "lucide-react";
import { useGetThermalFires } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { City } from "@/lib/cities";
import { motion } from "framer-motion";

interface ThermalPanelProps {
  city: City;
}

export function ThermalPanel({ city }: ThermalPanelProps) {
  // Pass lat/lon to search a bounding box around the city roughly
  const { data, isLoading, isError, error } = useGetThermalFires(
    { lat: city.lat, lon: city.lon, dayRange: 1 },
    { query: { retry: 1 } as any }
  );

  if (isLoading) {
    return <div className="glass-panel rounded-3xl p-6 h-[400px] animate-pulse">
      <Skeleton className="h-8 w-1/3 mb-6 bg-white/5" />
      <div className="space-y-3">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-12 w-full rounded-xl bg-white/5" />)}
      </div>
    </div>;
  }

  if (isError) {
    const isMissingKey = error?.message?.includes("API key");
    return (
      <div className="glass-panel rounded-3xl p-6 h-[400px] flex flex-col items-center justify-center text-center border-dashed border-white/20">
        <Flame className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-bold text-foreground/80">Thermal Intel Offline</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-[250px]">
          {isMissingKey ? "NASA FIRMS map key is not configured." : "Could not retrieve satellite thermal data."}
        </p>
      </div>
    );
  }

  const fireData = data;
  if (!fireData) return null;

  // Sort by Fire Radiative Power (FRP) if available, otherwise brightness
  const sortedHotspots = [...(fireData.hotspots || [])].sort((a, b) => {
    if (a.frp && b.frp) return b.frp - a.frp;
    if (a.brightness && b.brightness) return b.brightness - a.brightness;
    return 0;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="glass-panel rounded-3xl p-6 relative overflow-hidden group flex flex-col h-full"
    >
      <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-orange-600/10 blur-[80px] rounded-full pointer-events-none" />

      <div className="flex justify-between items-start mb-6 z-10">
        <div>
          <h2 className="text-xl font-display font-bold flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" /> Thermal Hotspots
          </h2>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
            <ActivitySquare className="h-3.5 w-3.5" />
            <span>24h NASA VIIRS Detection</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-xl">
          <span className="text-2xl font-bold text-orange-400 leading-none">{fireData.count}</span>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-orange-200/70 leading-none mt-1">Active<br/>Fires</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 z-10 space-y-2">
        {sortedHotspots.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground/60">
            <MapIcon className="h-10 w-10 mb-3 opacity-20" />
            <p>No significant thermal anomalies detected in the 100km radius.</p>
          </div>
        ) : (
          sortedHotspots.slice(0, 10).map((spot, i) => (
            <div key={i} className="bg-black/30 hover:bg-black/50 border border-white/5 rounded-xl p-3 flex justify-between items-center transition-colors">
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 h-2 w-2 rounded-full ${spot.frp && spot.frp > 50 ? 'bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-orange-400'}`} />
                <div>
                  <div className="text-xs font-mono text-foreground/80 flex items-center gap-2">
                    {spot.latitude.toFixed(4)}°, {spot.longitude.toFixed(4)}°
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1">
                    Detected: {spot.acq_time} UTC
                  </div>
                </div>
              </div>
              <div className="text-right">
                {spot.frp ? (
                  <>
                    <div className="text-sm font-bold text-orange-300">{spot.frp.toFixed(1)}</div>
                    <div className="text-[9px] text-muted-foreground uppercase">FRP (MW)</div>
                  </>
                ) : (
                  <>
                    <div className="text-sm font-bold text-yellow-300">{spot.brightness?.toFixed(0)}</div>
                    <div className="text-[9px] text-muted-foreground uppercase">Brightness</div>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
