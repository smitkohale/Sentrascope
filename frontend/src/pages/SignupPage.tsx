import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, User, Mail, ShieldCheck, Eye, EyeOff, AlertCircle, LayoutDashboard, LogOut, CheckCircle2 } from "lucide-react";
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
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative px-6 py-12">
      <div className="bg-glow" />
      <div className="w-full max-w-[420px] z-10 animate-in fade-in zoom-in-95 duration-500">
        <Link href="/" className="flex flex-col items-center gap-2 mb-8 hover:opacity-80 transition-opacity">
          <img src={Logo} alt="Logo" className="w-12 h-12 rounded-full object-cover drop-shadow-[0_0_15px_rgba(56,189,248,0.4)]" />
          <span className="text-xl font-[850] text-[#f8fafc] tracking-[-0.5px]">SentraScope</span>
        </Link>
        <main className="bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 rounded-[24px] p-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-[0.65rem] font-bold font-mono text-emerald-400 uppercase tracking-[0.18em]">Active Session</span>
          </div>
          <h2 className="text-2xl font-[800] text-center mb-1 tracking-tight text-white">You're already in</h2>
          <p className="text-[#94a3b8] text-[0.85rem] text-center mb-8 leading-relaxed">
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
            onClick={() => setLocation("/dashboard")}
            className="w-full py-3.5 mb-3 bg-[#38bdf8] text-[#020617] rounded-xl font-bold text-base flex items-center justify-center gap-2.5 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(56,189,248,0.35)] transition-[transform,box-shadow] duration-200"
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

export function SignupPage() {
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (AuthManager.isAuthenticated()) {
    return <ActiveSessionCard />;
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      let data: any = {};

try {
  data = await response.json();
} catch {
  data = {};
}

if (response.ok) {
  setLocation(`/verify?email=${encodeURIComponent(email)}`);
} else {
  throw new Error(data.message || "Registry failed.");
}
    } catch (err: any) {
      setError(err.message || "Connection to secure network failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative px-6 py-12">
      <div className="bg-glow" />

      <div className="w-full max-w-[420px] z-10 animate-in fade-in zoom-in-95 duration-500">
        <Link href="/" className="flex flex-col items-center gap-2 mb-8 hover:opacity-80 transition-opacity">
          <img src={Logo} alt="Logo" className="w-12 h-12 rounded-full object-cover drop-shadow-[0_0_15px_rgba(56,189,248,0.4)]" />
          <span className="text-xl font-[850] text-[#f8fafc] tracking-[-0.5px]">SentraScope</span>
        </Link>

        <main className="bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 rounded-[24px] p-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
          <Link href="/" className="inline-flex items-center gap-2 text-[#94a3b8] text-xs font-semibold mb-6 hover:text-[#38bdf8] hover:-translate-x-1 transition-[transform,color] duration-150">
            <ArrowLeft className="w-4 h-4" />
            Back to Terminal
          </Link>

          <h2 className="text-2xl font-[800] text-center mb-2 tracking-tight text-white">Operator Registry</h2>
          <p className="text-[#94a3b8] text-[0.85rem] text-center mb-8 leading-relaxed">Initialize your credentials for the SentraScope secure network.</p>

          {error && (
            <div className="bg-[#ef4444]/10 border border-[#ef4444]/20 text-[#fca5a5] p-3 rounded-xl text-sm mb-6 flex items-center gap-2.5">
              <AlertCircle className="w-[18px] h-[18px] shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-[0.75rem] font-bold text-[#94a3b8] uppercase tracking-[0.05em]">Operator Name</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none">
                  <User className="w-[18px] h-[18px]" />
                </div>
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Agent Name" 
                  required
                  autoComplete="name"
                  className="w-full pl-11 pr-4 py-3.5 bg-[#020617]/40 border border-white/10 rounded-xl text-white text-[0.95rem] outline-none focus:border-[#38bdf8] focus:bg-[#0f172a]/60 focus:ring-4 focus:ring-[#38bdf8]/15 transition-[border-color,background-color,box-shadow] duration-150 placeholder:text-white/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[0.75rem] font-bold text-[#94a3b8] uppercase tracking-[0.05em]">Intelligence ID</label>
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
                  className="w-full pl-11 pr-4 py-3.5 bg-[#020617]/40 border border-white/10 rounded-xl text-white text-[0.95rem] outline-none focus:border-[#38bdf8] focus:bg-[#0f172a]/60 focus:ring-4 focus:ring-[#38bdf8]/15 transition-[border-color,background-color,box-shadow] duration-150 placeholder:text-white/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[0.75rem] font-bold text-[#94a3b8] uppercase tracking-[0.05em]">Access Key</label>
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
                  className="w-full pl-11 pr-11 py-3.5 bg-[#020617]/40 border border-white/10 rounded-xl text-white text-[0.95rem] outline-none focus:border-[#38bdf8] focus:bg-[#0f172a]/60 focus:ring-4 focus:ring-[#38bdf8]/15 transition-[border-color,background-color,box-shadow] duration-150 placeholder:text-white/20"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-white p-1"
                >
                  {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3.5 mt-4 bg-[#38bdf8] text-[#020617] rounded-xl font-bold text-base flex items-center justify-center gap-2 hover:bg-[#7dd3fc] hover:-translate-y-px transition-[transform,background-color] duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span>Establishing...</span>
                  <div className="w-4 h-4 border-2 border-[#020617]/20 border-t-[#020617] rounded-full animate-spin" />
                </>
              ) : (
                <span>Establish Identity</span>
              )}
            </button>
          </form>

          <div className="mt-5 text-center">
            <Link href="/forgot-password" className="text-[#94a3b8] text-xs hover:text-[#38bdf8] transition-colors">Forgot your access key?</Link>
          </div>

          <div className="mt-4 text-center text-[0.85rem] text-[#94a3b8]">
            Already registered? <Link href="/login" className="text-[#38bdf8] font-semibold hover:underline">Login</Link>
          </div>
        </main>
      </div>
    </div>
  );
}
