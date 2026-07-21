import { Building2, Search, Database } from "lucide-react";
import { useGetIndiaOgdAirQuality } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useState } from "react";

export function CpcbPanel() {
  const [filterState, setFilterState] = useState("");
  
  const { data, isLoading, isError, error } = useGetIndiaOgdAirQuality(
    { limit: 50 },
    { query: { retry: 1 } as any }
  );

  if (isLoading) {
    return <div className="glass-panel rounded-3xl p-6 col-span-full h-[400px] animate-pulse">
      <Skeleton className="h-8 w-1/4 mb-6 bg-white/5" />
      <Skeleton className="h-full w-full bg-white/5" />
    </div>;
  }

  if (isError) {
    const isMissingKey = error?.message?.includes("API key");
    return (
      <div className="glass-panel rounded-3xl p-6 col-span-full h-[300px] flex flex-col items-center justify-center text-center border-dashed border-white/20">
        <Building2 className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-bold text-foreground/80">Govt Open Data Offline</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-[300px]">
          {isMissingKey ? "India OGD API key is not configured." : "Could not retrieve official CPCB network data."}
        </p>
      </div>
    );
  }

  const records = data?.records || [];
  
  // Filter logic (client-side since we fetched a batch)
  const filteredRecords = records.filter(r => 
    !filterState || (r.state && r.state.toLowerCase().includes(filterState.toLowerCase()))
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-panel rounded-3xl p-0 overflow-hidden col-span-full flex flex-col h-[500px]"
    >
      <div className="p-6 border-b border-white/5 bg-white/[0.02] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-display font-bold flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" /> Official CPCB Network Feed
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Data.gov.in Direct Integration</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Filter by State..."
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            className="bg-black/30 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-[border-color,box-shadow] duration-150 w-full sm:w-64"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-black/10">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="sticky top-0 bg-background/95 backdrop-blur-md border-b border-white/5 text-muted-foreground text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-semibold">State / City</th>
              <th className="px-6 py-4 font-semibold">Station</th>
              <th className="px-6 py-4 font-semibold text-center">Pollutant</th>
              <th className="px-6 py-4 font-semibold text-right">Avg Value</th>
              <th className="px-6 py-4 font-semibold text-right">Last Update</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                  No records found matching your filter.
                </td>
              </tr>
            ) : (
              filteredRecords.map((record, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-foreground/90">{record.city}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{record.state}</div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground/80 max-w-[200px] truncate" title={record.station}>
                    {record.station}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded font-mono font-bold text-[11px]">
                      {record.pollutant_id}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-mono font-bold text-foreground">{record.pollutant_avg}</span>
                    <span className="text-[10px] text-muted-foreground ml-1">{record.pollutant_unit}</span>
                  </td>
                  <td className="px-6 py-4 text-right text-xs text-muted-foreground/60 font-mono">
                    {record.last_update}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
