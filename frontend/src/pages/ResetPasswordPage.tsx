import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, ShieldCheck, Eye, EyeOff, AlertCircle, CheckCircle, XCircle } from "lucide-react";

const Logo = "/logo.svg";

const API_BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

type Status = "idle" | "loading" | "success" | "invalid";

export function ResetPasswordPage() {
  const [, setLocation] = useLocation();
  const token = new URLSearchParams(window.location.search).get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) setStatus("invalid");
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch(`${API_BASE}/api/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setTimeout(() => setLocation("/login"), 2500);
      } else {
        setStatus("idle");
        setError(data.message || "Reset failed. The link may have expired.");
      }
    } catch {
      setStatus("idle");
      setError("Network error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative px-6">
      <div className="bg-glow" />

      <div className="w-full max-w-[440px] z-10 animate-in fade-in zoom-in-95 duration-500">
        <Link href="/" className="flex flex-col items-center gap-3 mb-10 transition-transform hover:-translate-y-1">
          <img src={Logo} alt="Logo" className="w-14 h-14 rounded-full object-cover drop-shadow-[0_0_16px_rgba(56,189,248,0.35)]" />
          <span className="text-2xl font-[850] text-[#f8fafc] tracking-[-0.5px]">SentraScope</span>
        </Link>

        <main className="bg-[#0f172a]/70 backdrop-blur-xl border border-white/10 rounded-[28px] p-9 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.6)]">

          {status === "invalid" && (
            <div className="text-center py-4">
              <div className="flex justify-center mb-5">
                <XCircle className="w-14 h-14 text-[#ef4444]" style={{ filter: "drop-shadow(0 0 16px rgba(239,68,68,0.4))" }} />
              </div>
              <h2 className="text-[1.5rem] font-[800] tracking-tight text-white mb-3">Invalid Link</h2>
              <p className="text-[#94a3b8] text-[0.9rem] leading-relaxed mb-6">This reset link is missing or invalid. Please request a new one.</p>
              <Link href="/forgot-password" className="inline-block bg-[#38bdf8] text-[#020617] px-6 py-3 rounded-xl font-bold text-sm hover:-translate-y-0.5 transition-transform duration-200">
                Request New Link
              </Link>
            </div>
          )}

          {status === "success" && (
            <div className="text-center py-4">
              <div className="flex justify-center mb-5">
                <CheckCircle className="w-14 h-14 text-[#10b981]" style={{ filter: "drop-shadow(0 0 16px rgba(16,185,129,0.4))" }} />
              </div>
              <h2 className="text-[1.5rem] font-[800] tracking-tight text-white mb-3">Access Key Updated</h2>
              <p className="text-[#94a3b8] text-[0.9rem] leading-relaxed">Your password has been reset. Redirecting to login...</p>
            </div>
          )}

          {(status === "idle" || status === "loading") && token && (
            <>
              <Link href="/login" className="inline-flex items-center gap-2 text-[#94a3b8] text-sm font-semibold mb-7 hover:text-[#38bdf8] hover:-translate-x-1 transition-[transform,color] duration-150">
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>

              <h2 className="text-[1.6rem] font-[800] text-center mb-1.5 tracking-tight text-white">Set New Access Key</h2>
              <p className="text-[#94a3b8] text-[0.9rem] text-center mb-8 leading-relaxed">Choose a new secure password for your station.</p>

              {error && (
                <div className="bg-[#ef4444]/10 border border-[#ef4444]/20 text-[#fca5a5] p-3 rounded-xl text-sm mb-6 flex items-center gap-2.5">
                  <AlertCircle className="w-[18px] h-[18px] shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#94a3b8] uppercase tracking-[0.05em]">New Access Key</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none">
                      <ShieldCheck className="w-[18px] h-[18px]" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      autoComplete="new-password"
                      className="w-full pl-11 pr-11 py-3.5 bg-[#020617]/50 border border-white/10 rounded-xl text-white text-base outline-none focus:border-[#38bdf8] focus:bg-[#0f172a]/80 focus:ring-4 focus:ring-[#38bdf8]/10 transition-[border-color,background-color,box-shadow] duration-150 placeholder:text-white/20"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-white p-1">
                      {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#94a3b8] uppercase tracking-[0.05em]">Confirm Access Key</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none">
                      <ShieldCheck className="w-[18px] h-[18px]" />
                    </div>
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirm}
                      onChange={e => setConfirm(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      autoComplete="new-password"
                      className="w-full pl-11 pr-11 py-3.5 bg-[#020617]/50 border border-white/10 rounded-xl text-white text-base outline-none focus:border-[#38bdf8] focus:bg-[#0f172a]/80 focus:ring-4 focus:ring-[#38bdf8]/10 transition-[border-color,background-color,box-shadow] duration-150 placeholder:text-white/20"
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-white p-1">
                      {showConfirm ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                    </button>
                  </div>
                  {confirm && password !== confirm && (
                    <p className="text-[#ef4444] text-xs mt-1">Passwords do not match</p>
                  )}
                  {confirm && password === confirm && confirm.length >= 6 && (
                    <p className="text-[#10b981] text-xs mt-1 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Keys match</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-4 mt-2 bg-[#38bdf8] text-[#020617] rounded-xl font-bold text-base flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(56,189,248,0.3)] transition-[transform,box-shadow] duration-200 disabled:opacity-70 disabled:cursor-wait"
                >
                  {status === "loading" ? (
                    <>
                      <span>Updating Key...</span>
                      <div className="w-4 h-4 border-2 border-[#020617]/20 border-t-[#020617] rounded-full animate-spin" />
                    </>
                  ) : (
                    <span>Update Access Key</span>
                  )}
                </button>
              </form>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
