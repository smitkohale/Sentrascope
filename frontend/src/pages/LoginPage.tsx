import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Terminal, User, KeyRound, Eye, EyeOff, AlertCircle, LayoutDashboard, LogOut, CheckCircle2 } from "lucide-react";
import { AuthManager } from "@/lib/auth";

const Logo = "/logo.svg";

function ActiveSessionCard() {
  const [, setLocation] = useLocation();
  const session = AuthManager.getSession();
  const name = session?.user?.name || "Operator";
  const email = session?.user?.email || "";
  const sessionId = session?.sessionId || "—";
  const timestamp = session?.timestamp ? new Date(session.timestamp).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—";

  const handleTerminate = () => {
    localStorage.removeItem('sentra_session');
    localStorage.removeItem('sentraUserName');
    localStorage.removeItem('sentra_auth_token');
    setLocation("/login");
    window.location.reload();
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
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-[0.65rem] font-bold font-mono text-emerald-400 uppercase tracking-[0.18em]">Active Session</span>
          </div>

          <h2 className="text-[1.5rem] font-[800] text-center mb-1 tracking-tight text-white">You're already in</h2>
          <p className="text-[#94a3b8] text-[0.88rem] text-center mb-8 leading-relaxed">
            An active station session is detected for this operator.
          </p>

          <div className="bg-[#020617]/60 border border-white/8 rounded-2xl p-5 mb-7 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#38bdf8]/10 border border-[#38bdf8]/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-[#38bdf8]" />
              </div>
              <div className="min-w-0">
                <p className="text-[0.72rem] text-[#475569] font-semibold uppercase tracking-wider mb-0.5">Operator</p>
                <p className="text-white font-bold text-[0.92rem] truncate">{name}</p>
              </div>
            </div>
            <div className="h-px bg-white/6" />
            <div className="grid grid-cols-2 gap-3 text-[0.78rem]">
              <div>
                <p className="text-[#475569] text-[0.68rem] uppercase tracking-wider mb-0.5">Intelligence ID</p>
                <p className="text-[#94a3b8] truncate">{email}</p>
              </div>
              <div>
                <p className="text-[#475569] text-[0.68rem] uppercase tracking-wider mb-0.5">Session ID</p>
                <p className="text-[#94a3b8] font-mono truncate">{sessionId}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[#475569] text-[0.68rem] uppercase tracking-wider mb-0.5">Authenticated</p>
                <p className="text-[#94a3b8]">{timestamp}</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              const redirectTo = sessionStorage.getItem("sentra_redirect_after_login") || "/dashboard";
              sessionStorage.removeItem("sentra_redirect_after_login");
              setLocation(redirectTo);
            }}
            className="w-full py-4 mb-3 bg-[#38bdf8] text-[#020617] rounded-xl font-bold text-base flex items-center justify-center gap-2.5 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(56,189,248,0.35)] transition-[transform,box-shadow] duration-200"
          >
            <LayoutDashboard className="w-5 h-5" />
            Proceed to Dashboard
          </button>

          <button
            onClick={handleTerminate}
            className="w-full py-3.5 bg-transparent border border-[#ef4444]/30 text-[#ef4444] rounded-xl font-bold text-base flex items-center justify-center gap-2.5 hover:bg-[#ef4444]/8 hover:border-[#ef4444]/50 hover:-translate-y-0.5 transition-[transform,border-color,background-color] duration-200"
          >
            <LogOut className="w-4 h-4" />
            Terminate Session
          </button>
        </main>
      </div>
    </div>
  );
}

export function LoginPage() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (AuthManager.isAuthenticated()) {
    return <ActiveSessionCard />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      
      if (response.ok) {
        AuthManager.initSession(data.user?.name, email, data.token);
        const redirectTo = sessionStorage.getItem("sentra_redirect_after_login") || "/dashboard";
        sessionStorage.removeItem("sentra_redirect_after_login");
        setLocation(redirectTo);
      } else {
        throw new Error(data.message || "Uplink denied. Check ID or Key.");
      }
    } catch (err: any) {
      setError(err.message || "Handshake failed.");
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
          <Link href="/" className="inline-flex items-center gap-2 text-[#94a3b8] text-sm font-semibold mb-7 hover:text-[#38bdf8] hover:-translate-x-1 transition-[transform,color] duration-150">
            <Terminal className="w-4 h-4" />
            Exit to Terminal
          </Link>

          <h2 className="text-[1.6rem] font-[800] text-center mb-1.5 tracking-tight text-white">Operator Login</h2>
          <p className="text-[#94a3b8] text-[0.9rem] text-center mb-8">Establish a secure connection to your station.</p>

          {error && (
            <div className="bg-[#ef4444]/10 border border-[#ef4444]/20 text-[#fca5a5] p-3 rounded-xl text-sm mb-6 flex items-center gap-2.5">
              <AlertCircle className="w-[18px] h-[18px] shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#94a3b8] uppercase tracking-[0.05em]">Intelligence ID</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none">
                  <User className="w-[18px] h-[18px]" />
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

            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#94a3b8] uppercase tracking-[0.05em]">Access Key</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none">
                  <KeyRound className="w-[18px] h-[18px]" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••" 
                  required
                  autoComplete="current-password"
                  className="w-full pl-11 pr-11 py-3.5 bg-[#020617]/50 border border-white/10 rounded-xl text-white text-base outline-none focus:border-[#38bdf8] focus:bg-[#0f172a]/80 focus:ring-4 focus:ring-[#38bdf8]/10 transition-[border-color,background-color,box-shadow] duration-150 placeholder:text-white/20"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-white p-1"
                >
                  {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 mt-6 bg-[#38bdf8] text-[#020617] rounded-xl font-bold text-base flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(56,189,248,0.3)] transition-[transform,box-shadow] duration-200 disabled:opacity-70 disabled:cursor-wait"
            >
              {loading ? (
                <>
                  <span>Negotiating Handshake...</span>
                  <div className="w-4 h-4 border-2 border-[#020617]/20 border-t-[#020617] rounded-full animate-spin" />
                </>
              ) : (
                <span>Establish Uplink</span>
              )}
            </button>
          </form>

          <div className="mt-5 text-center">
            <Link href="/forgot-password" className="text-[#94a3b8] text-xs hover:text-[#38bdf8] transition-colors">Forgot your access key?</Link>
          </div>

          <div className="mt-4 text-center text-sm text-[#94a3b8]">
            New operator? <Link href="/signup" className="text-[#38bdf8] font-semibold hover:underline">Register now</Link>
          </div>
        </main>
      </div>
    </div>
  );
}
