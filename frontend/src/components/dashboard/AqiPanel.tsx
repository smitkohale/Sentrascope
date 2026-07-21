import { Wind, MapPin, AlertTriangle } from "lucide-react";
import { useGetAirQuality } from "@workspace/api-client-react";
import { getAqiColor } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { City } from "@/lib/cities";
import { motion } from "framer-motion";

interface AqiPanelProps {
  city: City;
}

export function AqiPanel({ city }: AqiPanelProps) {
  const { data, isLoading, isError, error } = useGetAirQuality(
    { city: city.name.toLowerCase() },
    { query: { retry: 1 } as any }
  );

  if (isLoading) {
    return <div className="glass-panel rounded-3xl p-6 h-[400px] animate-pulse">
      <Skeleton className="h-8 w-1/3 mb-6 bg-white/5" />
      <div className="flex justify-center"><Skeleton className="h-40 w-40 rounded-full bg-white/5" /></div>
    </div>;
  }

  if (isError) {
    // Check if it's a 503 from missing API key
    const isMissingKey = error?.message?.includes("API key");
    return (
      <div className="glass-panel rounded-3xl p-6 h-[400px] flex flex-col items-center justify-center text-center border-dashed border-white/20">
        <Wind className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-bold text-foreground/80">Air Quality Unavailable</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-[250px]">
          {isMissingKey ? "WAQI API key is not configured. Add WAQI_API_TOKEN in secrets." : "Could not retrieve real-time air quality data for this location."}
        </p>
      </div>
    );
  }

  const aqiData = data?.data;
  if (!aqiData) return null;

  const aqiVal = aqiData.aqi;
  const colors = getAqiColor(aqiVal);

  const pollutants = [
    { key: 'pm25', label: 'PM2.5', val: aqiData.iaqi?.pm25?.v },
    { key: 'pm10', label: 'PM10', val: aqiData.iaqi?.pm10?.v },
    { key: 'no2', label: 'NO₂', val: aqiData.iaqi?.no2?.v },
    { key: 'o3', label: 'O₃', val: aqiData.iaqi?.o3?.v },
    { key: 'so2', label: 'SO₂', val: aqiData.iaqi?.so2?.v },
    { key: 'co', label: 'CO', val: aqiData.iaqi?.co?.v },
  ].filter(p => p.val !== undefined);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="glass-panel rounded-3xl p-6 relative overflow-hidden group flex flex-col h-full"
    >
      {/* Abstract background gradient based on AQI */}
      <div className={`absolute -right-20 -top-20 w-64 h-64 blur-[80px] rounded-full opacity-20 pointer-events-none transition-colors duration-1000 ${colors.bg.replace('/20', '')}`} />

      <div className="flex justify-between items-start mb-6 z-10">
        <div>
          <h2 className="text-xl font-display font-bold flex items-center gap-2">
            <Wind className="h-5 w-5 text-primary" /> Air Quality
          </h2>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
            <MapPin className="h-3.5 w-3.5" />
            <span>{aqiData.city}, {city.state}</span>
          </div>
        </div>
        <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground bg-black/20 px-2 py-1 rounded border border-white/5">
          Real-time
        </div>
      </div>

      <div className="flex flex-col items-center justify-center flex-1 z-10 py-4">
        {/* AQI Dial Simulation */}
        <div className={`relative flex items-center justify-center w-48 h-48 rounded-full border-[6px] ${colors.border} ${colors.bg} shadow-[inset_0_0_30px_rgba(0,0,0,0.5)]`}>
          <div className="absolute inset-2 rounded-full border border-white/10 bg-background/80 flex flex-col items-center justify-center">
            <span className="text-5xl font-display font-bold tracking-tighter mt-2">{aqiVal}</span>
            <span className="text-xs font-medium text-muted-foreground tracking-widest uppercase mt-1">US AQI</span>
          </div>
        </div>
        
        <div className={`mt-6 px-4 py-1.5 rounded-full border ${colors.border} ${colors.bg} ${colors.text} text-sm font-bold tracking-wide uppercase shadow-lg`}>
          {colors.label}
        </div>
        {aqiData.dominentpol && (
           <div className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
             <AlertTriangle className="h-3 w-3" />
             Primary Pollutant: <span className="font-bold text-foreground uppercase">{aqiData.dominentpol}</span>
           </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 mt-auto z-10 pt-4 border-t border-white/10">
        {pollutants.slice(0, 3).map(p => (
          <div key={p.key} className="bg-black/20 rounded-xl p-3 border border-white/5 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors">
            <span className="text-[10px] text-muted-foreground font-medium mb-1">{p.label}</span>
            <span className="text-lg font-mono font-bold">{p.val}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
