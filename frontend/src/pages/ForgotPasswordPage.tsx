import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Mail, AlertCircle, CheckCircle } from "lucide-react";

const Logo = "/logo.svg";

const API_BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setSent(true);
      } else {
        throw new Error(data.message || "Failed to send reset link.");
      }
    } catch (err: any) {
      setError(err.message || "Request failed.");
    } finally {
      setLoading(false);
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
          <Link href="/login" className="inline-flex items-center gap-2 text-[#94a3b8] text-sm font-semibold mb-7 hover:text-[#38bdf8] hover:-translate-x-1 transition-[transform,color] duration-150">
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>

          {!sent ? (
            <>
              <h2 className="text-[1.6rem] font-[800] text-center mb-1.5 tracking-tight text-white">Reset Access Key</h2>
              <p className="text-[#94a3b8] text-[0.9rem] text-center mb-8 leading-relaxed">Enter your Intelligence ID and we'll dispatch a secure reset link to your station.</p>

              {error && (
                <div className="bg-[#ef4444]/10 border border-[#ef4444]/20 text-[#fca5a5] p-3 rounded-xl text-sm mb-6 flex items-center gap-2.5">
                  <AlertCircle className="w-[18px] h-[18px] shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#94a3b8] uppercase tracking-[0.05em]">Intelligence ID</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none">
                      <Mail className="w-[18px] h-[18px]" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="agent@sentrascope.io"
                      required
                      autoComplete="email"
                      className="w-full pl-11 pr-4 py-3.5 bg-[#020617]/50 border border-white/10 rounded-xl text-white text-base outline-none focus:border-[#38bdf8] focus:bg-[#0f172a]/80 focus:ring-4 focus:ring-[#38bdf8]/10 transition-[border-color,background-color,box-shadow] duration-150 placeholder:text-white/20"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 mt-2 bg-[#38bdf8] text-[#020617] rounded-xl font-bold text-base flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(56,189,248,0.3)] transition-[transform,box-shadow] duration-200 disabled:opacity-70 disabled:cursor-wait"
                >
                  {loading ? (
                    <>
                      <span>Dispatching Link...</span>
                      <div className="w-4 h-4 border-2 border-[#020617]/20 border-t-[#020617] rounded-full animate-spin" />
                    </>
                  ) : (
                    <span>Dispatch Reset Link</span>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="flex justify-center mb-5">
                <div className="w-16 h-16 rounded-full bg-[#38bdf8]/10 border border-[#38bdf8]/20 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-[#38bdf8]" />
                </div>
              </div>
              <h2 className="text-[1.5rem] font-[800] tracking-tight text-white mb-3">Link Dispatched</h2>
              <p className="text-[#94a3b8] text-[0.9rem] leading-relaxed mb-6">
                If <span className="text-white font-semibold">{email}</span> is registered, a password reset link has been sent. Check your inbox.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-widest bg-[#38bdf8]/08 border border-[#38bdf8]/20 text-[#38bdf8]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-pulse inline-block" />
                Awaiting Reset...
              </div>
              <div className="mt-6">
                <Link href="/login" className="text-[#94a3b8] text-sm hover:text-[#38bdf8] transition-colors">Back to Login</Link>
              </div>
            </div>
          )}

          {!sent && (
            <div className="mt-6 text-center text-sm text-[#94a3b8]">
              Remembered it?{" "}
              <Link href="/login" className="text-[#38bdf8] font-semibold hover:underline">Login</Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
