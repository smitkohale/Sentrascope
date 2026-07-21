import { AlertTriangle, KeyRound, CheckCircle2 } from "lucide-react";
import { useGetConfigStatus } from "@workspace/api-client-react";
import { motion } from "framer-motion";

export function ConfigBanner() {
  const { data: config, isLoading, isError } = useGetConfigStatus({
    query: {
      refetchInterval: 10000, // Check every 10s
    } as any
  });

  if (isLoading || isError || !config) return null;

  const missingKeys = [];
  if (!config.waqi) missingKeys.push("WAQI (Air Quality)");
  if (!config.nasaFirms) missingKeys.push("NASA FIRMS (Thermal/Fires)");
  if (!config.openUv) missingKeys.push("OpenUV (Radiological)");
  if (!config.indiaOgd) missingKeys.push("India OGD (CPCB Data)");

  const isFullyConfigured = missingKeys.length === 0;

  if (isFullyConfigured) {
    return null; // Don't show anything if all good
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-lg shadow-rose-900/20"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-rose-400">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-rose-200">Missing API Configuration</h3>
        <p className="text-xs text-rose-300/80 mt-1">
          SentraScope requires external API keys to function fully. The following services are disabled:
        </p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {missingKeys.map(key => (
            <li key={key} className="text-[10px] uppercase tracking-wider font-semibold bg-rose-950/50 text-rose-300 px-2 py-1 rounded border border-rose-500/20 flex items-center gap-1.5">
              <KeyRound className="h-3 w-3" /> {key}
            </li>
          ))}
        </ul>
      </div>
      <div className="text-xs text-rose-200/60 bg-black/20 p-3 rounded-xl border border-rose-500/10">
        Add these in <strong className="text-rose-200">Replit Secrets</strong> to activate intel feeds.
      </div>
    </motion.div>
  );
}
