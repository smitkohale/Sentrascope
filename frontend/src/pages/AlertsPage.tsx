import { Link } from "wouter";
import { LayoutDashboard, Clock, ShieldCheck, CheckCircle, Send, Loader2, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { AuthManager } from "@/lib/auth";

const Logo = "/logo.svg";

type SendState = "idle" | "loading" | "success" | "error";

async function readApiError(res: Response): Promise<string> {
  const fallback = res.status === 401
    ? "Please log in again before sending a report."
    : "Failed to send report.";

  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return fallback;
  }

  try {
    const err = await res.json() as { message?: string };
    return err.message ?? fallback;
  } catch {
    return fallback;
  }
}

export function AlertsPage() {
  const [daily, setDaily] = useState(true);
  const [weekly, setWeekly] = useState(false);
  const [monthly, setMonthly] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showStatus, setShowStatus] = useState<"saved" | "sent" | null>(null);
  const [sendStates, setSendStates] = useState<Record<string, SendState>>({
    daily: "idle", weekly: "idle", monthly: "idle",
  });
  const [sendError, setSendError] = useState<string | null>(null);

  useEffect(() => {
    const token = AuthManager.getToken();
    if (!token) return;
    fetch("/api/alerts", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          setDaily(data.daily);
          setWeekly(data.weekly);
          setMonthly(data.monthly);
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    const token = AuthManager.getToken();
    if (!token) return;
    setSaving(true);
    try {
      await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ daily, weekly, monthly }),
      });
      setShowStatus("saved");
      setTimeout(() => setShowStatus(null), 3500);
    } finally {
      setSaving(false);
    }
  };

  const handleSendNow = async (period: "daily" | "weekly" | "monthly") => {
    const token = AuthManager.getToken();
    if (!token) return;
    setSendStates(s => ({ ...s, [period]: "loading" }));
    setSendError(null);
    try {
      const res = await fetch("/api/report/send-now", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ period }),
      });
      if (!res.ok) {
        throw new Error(await readApiError(res));
      }
      setSendStates(s => ({ ...s, [period]: "success" }));
      setShowStatus("sent");
      setTimeout(() => {
        setSendStates(s => ({ ...s, [period]: "idle" }));
        setShowStatus(null);
      }, 4000);
    } catch (err) {
      setSendStates(s => ({ ...s, [period]: "error" }));
      setSendError(err instanceof Error && err.message !== "Failed to fetch" ? err.message : "Cannot reach the backend. Please restart the API server.");
      setTimeout(() => {
        setSendStates(s => ({ ...s, [period]: "idle" }));
        setSendError(null);
      }, 5000);
    }
  };

  const intervals: { key: "daily" | "weekly" | "monthly"; label: string; desc: string; enabled: boolean; setEnabled: (v: boolean) => void; scheduleHint: string }[] = [
    {
      key: "daily",
      label: "Daily Intelligence Brief",
      desc: "24-hour summary of AQI, thermal, UV & noise — sent every day at 12:00 AM IST.",
      enabled: daily,
      setEnabled: setDaily,
      scheduleHint: "Every day at 12:00 AM IST",
    },
    {
      key: "weekly",
      label: "Weekly Strategic Review",
      desc: "7-day environmental analysis across all states — sent every Sunday at 12:00 AM IST.",
      enabled: weekly,
      setEnabled: setWeekly,
      scheduleHint: "Every Sunday at 12:00 AM IST",
    },
    {
      key: "monthly",
      label: "Monthly Impact Report",
      desc: "30-day ecological overview comparing trends across India — sent on the last day of the month at 12:00 AM IST.",
      enabled: monthly,
      setEnabled: setMonthly,
      scheduleHint: "Last day of every month at 12:00 AM IST",
    },
  ];

  const anySendNowEnabled = daily || weekly || monthly;

  return (
    <div className="min-h-screen relative px-4 sm:px-6 text-[#f8fafc] pb-20" style={{ background: "#020617" }}>
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(56,189,248,0.08) 0%, transparent 70%)" }} />

      <header className="h-[70px] sm:h-[80px] bg-[#020617]/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4 sm:px-6 -mx-4 sm:-mx-6 sticky top-0 z-50">
        <Link href="/dashboard" className="flex items-center gap-2 sm:gap-3 text-white hover:opacity-80 transition-opacity">
          <img src={Logo} alt="Logo" className="w-8 sm:w-9 h-8 sm:h-9 rounded-full object-cover drop-shadow-[0_0_10px_rgba(56,189,248,0.3)]" />
          <span className="text-base sm:text-xl font-[850] tracking-[-0.5px] uppercase">SentraScope</span>
        </Link>
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 sm:gap-2 bg-transparent border border-white/10 text-white px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm hover:bg-white/5 hover:border-white transition-[border-color,background-color] duration-150">
          <LayoutDashboard className="w-4 sm:w-[18px] h-4 sm:h-[18px]" /> <span className="hidden sm:inline">Dashboard</span>
        </Link>
      </header>

      <div className="max-w-[800px] mx-auto mt-10 sm:mt-[60px] animate-in slide-in-from-bottom-8 duration-700">
        <div className="mb-7 sm:mb-10">
          <h1 className="text-[1.8rem] sm:text-[2.5rem] font-[850] tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-[#94a3b8] mb-2">
            Intelligence Cadence
          </h1>
          <p className="text-[#94a3b8] text-sm sm:text-base font-medium">
            Choose your reporting frequency. Each report covers India and all states with real-time AQI, Thermal, UV, and Noise data.
          </p>
        </div>

        {/* ── Interval toggles ── */}
        <div className="bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 rounded-[28px] p-6 sm:p-8 mb-5 shadow-2xl">
          <h3 className="text-xs uppercase tracking-[0.2em] text-[#38bdf8] mb-6 flex items-center gap-3 font-[800]">
            <Clock className="w-4 h-4" /> Reporting Intervals
          </h3>

          <div className="flex flex-col divide-y divide-white/5">
            {intervals.map(({ key, label, desc, enabled, setEnabled, scheduleHint }) => (
              <div key={key} className="flex items-center justify-between py-5 gap-4 transition-opacity" style={{ opacity: enabled ? 1 : 0.5 }}>
                <div className="flex-1 min-w-0">
                  <span className="block font-bold text-[1rem] sm:text-[1.05rem] text-white mb-1">{label}</span>
                  <span className="block text-sm text-[#94a3b8] leading-relaxed">{desc}</span>
                  <span className="block text-xs text-[#475569] mt-1 font-mono">{scheduleHint}</span>
                </div>
                <label className="relative inline-block w-[52px] h-[28px] shrink-0 cursor-pointer">
                  <input type="checkbox" className="opacity-0 w-0 h-0 peer" checked={enabled} onChange={e => setEnabled(e.target.checked)} />
                  <span className="absolute inset-0 bg-[#1e293b] rounded-[34px] border border-white/10 transition-[background-color,border-color] duration-200 peer-checked:bg-gradient-to-br peer-checked:from-[#38bdf8] peer-checked:to-[#2563eb] before:absolute before:content-[''] before:h-5 before:w-5 before:left-[3px] before:bottom-[3px] before:bg-white before:rounded-full before:transition-transform before:duration-200 peer-checked:before:translate-x-[24px]"></span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* ── Send Now ── */}
        <div className="bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 rounded-[28px] p-6 sm:p-8 mb-5 shadow-2xl">
          <h3 className="text-xs uppercase tracking-[0.2em] text-[#38bdf8] mb-2 flex items-center gap-3 font-[800]">
            <Send className="w-4 h-4" /> Send Report Now
          </h3>
          <p className="text-[#64748b] text-sm mb-6">
            Trigger a report immediately to your registered email. Only enabled intervals can be sent.
          </p>

          {sendError && (
            <div className="flex items-center gap-2 mb-4 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm font-medium">
              <XCircle className="w-4 h-4 shrink-0" /> {sendError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {intervals.map(({ key, label }) => {
              const enabled = key === "daily" ? daily : key === "weekly" ? weekly : monthly;
              const state = sendStates[key];
              return (
                <button
                  key={key}
                  onClick={() => handleSendNow(key)}
                  disabled={!enabled || state === "loading"}
                  className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl font-[700] text-sm border transition-[background-color,border-color,color] duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={
                    state === "success"
                      ? { background: "rgba(16,185,129,0.15)", borderColor: "rgba(16,185,129,0.4)", color: "#10b981" }
                      : state === "error"
                        ? { background: "rgba(239,68,68,0.12)", borderColor: "rgba(239,68,68,0.3)", color: "#ef4444" }
                        : enabled
                          ? { background: "rgba(56,189,248,0.1)", borderColor: "rgba(56,189,248,0.25)", color: "#38bdf8" }
                          : { background: "transparent", borderColor: "rgba(255,255,255,0.08)", color: "#475569" }
                  }
                >
                  {state === "loading" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : state === "success" ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : state === "error" ? (
                    <XCircle className="w-4 h-4" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {state === "success" ? "Sent!" : state === "error" ? "Failed" : state === "loading" ? "Sending…" : `Send ${key.charAt(0).toUpperCase() + key.slice(1)}`}
                </button>
              );
            })}
          </div>

          {!anySendNowEnabled && (
            <p className="text-[#475569] text-xs mt-4 text-center">Enable at least one interval above to send a report.</p>
          )}
        </div>

        {/* ── What's in each report ── */}
        <div className="bg-[#0f172a]/40 border border-white/5 rounded-[24px] p-6 mb-5">
          <h3 className="text-xs uppercase tracking-[0.2em] text-[#475569] mb-4 font-[800]">Report Contents</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: "💨", label: "AQI", desc: "Air quality index" },
              { icon: "🔥", label: "Thermal", desc: "Fire hotspot count" },
              { icon: "☀️", label: "UV", desc: "Ultraviolet index" },
              { icon: "🔊", label: "Noise", desc: "dB pollution estimate" },
            ].map(m => (
              <div key={m.label} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 text-center">
                <div className="text-2xl mb-2">{m.icon}</div>
                <div className="text-white font-[700] text-sm mb-1">{m.label}</div>
                <div className="text-[#475569] text-xs">{m.desc}</div>
              </div>
            ))}
          </div>
          <p className="text-[#334155] text-xs mt-4 leading-relaxed">
            Each report covers <strong className="text-[#475569]">India (national overview)</strong> followed by all <strong className="text-[#475569]">37 states & UTs in alphabetical order</strong>.
            Data sources: CPCB via data.gov.in (AQI) · NASA FIRMS VIIRS (thermal) · OpenUV (UV) · density model (noise).
          </p>
        </div>

        {/* ── Actions ── */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-6 sm:mt-8">
          <Link href="/dashboard" className="px-7 sm:px-9 py-3.5 sm:py-4 bg-transparent border border-white/10 text-white rounded-2xl font-bold text-center hover:bg-white/5 hover:border-white transition-[border-color,background-color] duration-150">
            Discard
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-7 sm:px-9 py-3.5 sm:py-4 bg-[#38bdf8] text-[#020617] rounded-2xl font-[800] inline-flex items-center justify-center gap-3 hover:-translate-y-1 hover:shadow-[0_15px_30px_-10px_rgba(56,189,248,0.5)] transition-[transform,box-shadow] duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving…</> : <><ShieldCheck className="w-5 h-5" /> Update Protocol</>}
          </button>
        </div>
      </div>

      {/* ── Toast ── */}
      <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 px-7 py-3.5 rounded-full font-[800] flex items-center gap-3 z-50 shadow-2xl transition-[transform,opacity] duration-300 ${showStatus ? "translate-y-0 opacity-100" : "translate-y-[120px] opacity-0"} ${showStatus === "sent" ? "bg-[#38bdf8] text-[#020617]" : "bg-white text-[#020617]"}`}>
        <CheckCircle className="w-5 h-5" />
        {showStatus === "sent" ? "Report dispatched to your inbox!" : "Cadence updated successfully."}
      </div>
    </div>
  );
}
