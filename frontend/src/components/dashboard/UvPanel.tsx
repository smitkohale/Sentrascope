import { Sun, ShieldAlert, Timer, Activity } from "lucide-react";
import { useGetUvData } from "@workspace/api-client-react";
import { getUvColor } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { City } from "@/lib/cities";
import { motion } from "framer-motion";

interface UvPanelProps {
  city: City;
}

export function UvPanel({ city }: UvPanelProps) {
  const { data, isLoading, isError, error } = useGetUvData(
    { lat: city.lat, lon: city.lon },
    { query: { retry: 1 } as any }
  );

  if (isLoading) {
    return <div className="glass-panel rounded-3xl p-6 h-[400px] animate-pulse">
      <Skeleton className="h-8 w-1/3 mb-6 bg-white/5" />
      <div className="flex justify-center"><Skeleton className="h-32 w-full rounded-2xl bg-white/5" /></div>
    </div>;
  }

  if (isError) {
    const isMissingKey = error?.message?.includes("API key");
    return (
      <div className="glass-panel rounded-3xl p-6 h-[400px] flex flex-col items-center justify-center text-center border-dashed border-white/20">
        <Sun className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-bold text-foreground/80">Radiological Intel Offline</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-[250px]">
          {isMissingKey ? "OpenUV API key is not configured." : "Could not retrieve UV and ozone data."}
        </p>
      </div>
    );
  }

  const uvData = data?.result;
  if (!uvData) return null;

  const uvVal = uvData.uv;
  const colors = getUvColor(uvVal);

  // Find max safe exposure (using skin type 3 as average baseline)
  const safeTime = uvData.safe_exposure_time?.st3;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="glass-panel rounded-3xl p-6 relative overflow-hidden group flex flex-col h-full"
    >
      <div className={`absolute -right-20 bottom-0 w-64 h-64 blur-[100px] rounded-full opacity-20 pointer-events-none transition-colors duration-1000 ${colors.bg.replace('/20', '')}`} />

      <div className="flex justify-between items-start mb-6 z-10">
        <div>
          <h2 className="text-xl font-display font-bold flex items-center gap-2">
            <Sun className="h-5 w-5 text-yellow-400" /> UV & Radiation
          </h2>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Solar Risk Assessment</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center z-10">
        
        <div className="flex items-end gap-4 mb-8">
          <div className={`text-7xl font-display font-bold tracking-tighter ${colors.text} leading-none`}>
            {uvVal.toFixed(1)}
          </div>
          <div className="pb-2">
            <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-1">UV Index</div>
            <div className={`text-xs px-2 py-0.5 rounded border ${colors.border} ${colors.bg} ${colors.text} font-bold inline-block`}>
              {colors.label}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-black/20 border border-white/5 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Timer className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Safe Exposure</span>
            </div>
            <div className="text-xl font-mono font-bold text-foreground">
              {safeTime ? `${safeTime} min` : 'N/A'}
            </div>
            <div className="text-[10px] text-muted-foreground mt-1">Avg. Skin Type 3</div>
          </div>
          
          <div className="bg-black/20 border border-white/5 rounded-2xl p-4">
             <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Activity className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Strat. Ozone</span>
            </div>
            <div className="text-xl font-mono font-bold text-foreground">
              {uvData.ozone ? `${uvData.ozone.toFixed(1)}` : 'N/A'}
            </div>
            <div className="text-[10px] text-muted-foreground mt-1">Dobson Units (DU)</div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
