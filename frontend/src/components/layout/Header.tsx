import { memo, useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { format } from "date-fns";

interface HeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

const Logo = "/logo.svg";

export const Header = memo(function Header({ onRefresh, isRefreshing }: HeaderProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-xl">
      <div className="flex h-16 items-center px-6 max-w-[1600px] mx-auto w-full justify-between">
        <div className="flex items-center gap-3">
          <img
            src={Logo}
            alt="SentraScope"
            className="w-10 h-10 rounded-xl shadow-lg object-cover"
            style={{ filter: "drop-shadow(0 0 10px rgba(56,189,248,0.3))" }}
          />
          <div className="flex flex-col">
            <h1 className="text-xl font-display font-bold leading-tight text-gradient">SentraScope</h1>
            <span className="text-[10px] uppercase tracking-widest text-primary font-semibold">India Environmental Intel</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-xs text-muted-foreground font-medium">System Time</span>
            <span className="text-sm font-mono font-bold text-foreground/90">
              {format(now, "MMM dd, yyyy HH:mm:ss")}
            </span>
          </div>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center justify-center h-10 w-10 rounded-full border border-white/10 bg-secondary/50 hover:bg-secondary text-foreground transition-[background-color,box-shadow] duration-300 hover:shadow-lg hover:shadow-primary/10 disabled:opacity-50 group"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin text-primary" : "group-hover:text-primary transition-colors"}`} />
          </button>
        </div>
      </div>
    </header>
  );
});
