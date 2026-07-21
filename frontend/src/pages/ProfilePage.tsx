import { Link, useLocation } from "wouter";
import { ArrowLeft, UserCog, Key, Fingerprint, ShieldCheck, LogOut, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { AuthManager } from "@/lib/auth";

export function ProfilePage() {
  const [, navigate] = useLocation();
  const [userState, setUserState] = useState({ name: "Operator", region: "India" });
  const [sessionInfo, setSessionInfo] = useState({ uid: "IDENTIFYING...", sid: "---", email: "---", since: "---" });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [inputName, setInputName] = useState("");
  const [inputRegion, setInputRegion] = useState("");
  const [saved, setSaved] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);

  useEffect(() => {
    let uid = localStorage.getItem("sentra_permanent_uid");
    if (!uid) {
      uid = `USR-${Math.random().toString(36).substr(2, 4).toUpperCase()}-${Date.now().toString().slice(-4)}`;
      localStorage.setItem("sentra_permanent_uid", uid);
    }

    const session = AuthManager.getSession();
    const sid = session?.sessionId || "---";

    const name = localStorage.getItem("sentraUserName") || session?.user?.name || "Operator";
    const email = session?.user?.email || "---";
    const region = localStorage.getItem("sentraUserRegion") || "India";
    const since = session?.timestamp
      ? new Date(session.timestamp).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
      : new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

    setUserState({ name, region });
    setSessionInfo({ uid, sid, email, since });
  }, []);

  const openEdit = () => {
    setInputName(userState.name);
    setInputRegion(userState.region);
    setEditModalOpen(true);
    setSaved(false);
  };

  const saveProfile = () => {
    const newName = inputName.trim() || userState.name;
    const newRegion = inputRegion.trim() || userState.region;
    setUserState({ name: newName, region: newRegion });
    localStorage.setItem("sentraUserName", newName);
    localStorage.setItem("sentraUserRegion", newRegion);
    const session = AuthManager.getSession();
    if (session) {
      session.user.name = newName;
      localStorage.setItem("sentra_session", JSON.stringify(session));
    }
    setSaved(true);
    setTimeout(() => setEditModalOpen(false), 900);
  };

  const terminateSession = () => {
    AuthManager.logout();
    navigate("/login");
  };

  const initials = userState.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "OP";

  return (
    <div className="min-h-screen relative px-4 sm:px-6 text-[#f8fafc] pb-20" style={{ background: "#020617" }}>
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(56,189,248,0.08) 0%, transparent 70%)" }} />

      {/* Header */}
      <header className="h-[64px] sm:h-[72px] flex items-center justify-between sticky top-0 z-50 -mx-4 sm:-mx-6 px-4 sm:px-6 border-b"
        style={{ background: "rgba(2,6,23,0.85)", backdropFilter: "blur(16px)", borderColor: "rgba(255,255,255,0.07)" }}>
        <Link href="/dashboard" className="flex items-center gap-2 sm:gap-3 text-white hover:opacity-80 transition-opacity no-underline">
          <img src="/logo.svg" alt="Logo" className="w-7 sm:w-8 h-7 sm:h-8 rounded-full object-cover" />
          <span className="text-sm sm:text-base font-black tracking-tight uppercase">SentraScope</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-1">
          {[{ href: "/dashboard", label: "Terminal" }, { href: "/alerts", label: "Alerts" }].map(l => (
            <Link key={l.href} href={l.href}
              className="px-4 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest hover:text-white hover:bg-white/5 rounded-lg transition-[color,background-color] duration-150 no-underline">
              {l.label}
            </Link>
          ))}
        </nav>

        <Link href="/dashboard"
          className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl font-bold text-xs sm:text-sm text-slate-300 hover:text-white transition-colors duration-150 no-underline"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Back to HQ</span>
        </Link>
      </header>

      <div className="max-w-[860px] mx-auto mt-8 sm:mt-14 px-0 sm:px-0">
        {/* Profile Hero */}
        <section className="rounded-2xl sm:rounded-3xl p-6 sm:p-10 mb-5 sm:mb-6 flex flex-col sm:flex-row items-center gap-5 sm:gap-8 relative overflow-hidden"
          style={{ background: "rgba(15,23,42,0.6)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" }}>
          <div className="w-20 sm:w-28 h-20 sm:h-28 rounded-[20px] sm:rounded-[28px] flex items-center justify-center text-3xl sm:text-4xl font-black text-white shrink-0"
            style={{ background: "linear-gradient(135deg, #38bdf8, #2563eb)", boxShadow: "0 20px 40px -10px rgba(56,189,248,0.35)" }}>
            {initials}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-2 text-white">{userState.name}</h1>
            <div className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm text-sky-400 px-3 py-1.5 rounded-xl"
              style={{ background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.2)" }}>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{sessionInfo.uid}</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 font-mono">Active since {sessionInfo.since}</p>
          </div>
          <div className="shrink-0 flex flex-row sm:flex-col gap-2 sm:gap-3 w-full sm:w-auto">
            <button onClick={openEdit}
              className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm transition-transform duration-200 hover:-translate-y-0.5"
              style={{ background: "#38bdf8", color: "#020617" }}>
              <UserCog className="w-4 h-4" /> Edit Identity
            </button>
            <button
              onClick={() => setLogoutConfirm(true)}
              className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm transition-[transform,color,background-color] duration-200 hover:-translate-y-0.5 text-red-400 hover:text-white hover:bg-red-500/20"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <LogOut className="w-4 h-4" /> Terminate
            </button>
          </div>
        </section>

        {/* Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Authentication */}
          <div className="rounded-3xl p-8 transition-transform duration-200 hover:-translate-y-0.5"
            style={{ background: "rgba(15,23,42,0.6)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" }}>
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-sky-400 mb-6 flex items-center gap-2 font-black">
              <Key className="w-3.5 h-3.5" /> Authentication
            </h3>
            <div className="space-y-0 divide-y divide-white/5">
              {[
                { label: "Session ID",    value: sessionInfo.sid },
                { label: "Access Level",  value: "Field Operator" },
                { label: "Auth Protocol", value: "JWT / HTTPS" },
                { label: "Status",        value: "✓  Active" },
              ].map(row => (
                <div key={row.label} className="flex justify-between items-center py-4">
                  <span className="text-slate-400 text-sm">{row.label}</span>
                  <span className="font-mono text-[13px] font-bold text-white">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Personal Details */}
          <div className="rounded-3xl p-8 transition-transform duration-200 hover:-translate-y-0.5"
            style={{ background: "rgba(15,23,42,0.6)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" }}>
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-sky-400 mb-6 flex items-center gap-2 font-black">
              <Fingerprint className="w-3.5 h-3.5" /> Personal Details
            </h3>
            <div className="space-y-0 divide-y divide-white/5">
              {[
                { label: "Email",           value: sessionInfo.email },
                { label: "Display Name",    value: userState.name },
                { label: "Deployment Zone", value: userState.region },
              ].map(row => (
                <div key={row.label} className="flex justify-between items-center py-4">
                  <span className="text-slate-400 text-sm">{row.label}</span>
                  <span className="text-[13px] font-bold text-white truncate max-w-[180px] text-right">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: "rgba(2,6,23,0.8)", backdropFilter: "blur(16px)" }}
          onClick={e => e.target === e.currentTarget && setEditModalOpen(false)}>
          <div className="w-full max-w-[440px] rounded-[32px] p-10 shadow-2xl"
            style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)" }}>
            <h2 className="text-2xl font-black tracking-tight text-white mb-1">Edit Identity</h2>
            <p className="text-slate-400 text-sm mb-8">Update your display name and deployment zone.</p>
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] text-sky-400 uppercase tracking-[0.2em] font-black mb-2">Display Name</label>
                <input type="text" value={inputName} onChange={e => setInputName(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl text-white text-sm outline-none transition-[border-color] duration-150"
                  style={{ background: "rgba(2,6,23,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}
                  onFocus={e => (e.target.style.borderColor = "#38bdf8")}
                  onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
              </div>
              <div>
                <label className="block text-[10px] text-sky-400 uppercase tracking-[0.2em] font-black mb-2">Zone / Region</label>
                <input type="text" value={inputRegion} onChange={e => setInputRegion(e.target.value)} placeholder="e.g. Mumbai, MH"
                  className="w-full px-4 py-3.5 rounded-xl text-white text-sm outline-none transition-[border-color] duration-150"
                  style={{ background: "rgba(2,6,23,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}
                  onFocus={e => (e.target.style.borderColor = "#38bdf8")}
                  onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-8">
              <button onClick={saveProfile}
                className="py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-[background-color] duration-200"
                style={{ background: saved ? "#10b981" : "#38bdf8", color: "#020617" }}>
                {saved ? <><CheckCircle className="w-4 h-4" /> Saved!</> : "Commit Changes"}
              </button>
              <button onClick={() => setEditModalOpen(false)}
                className="py-3.5 rounded-xl font-bold text-sm text-slate-300 hover:text-white transition-colors duration-150"
                style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Terminate Session Confirm Modal */}
      {logoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: "rgba(2,6,23,0.85)", backdropFilter: "blur(16px)" }}
          onClick={e => e.target === e.currentTarget && setLogoutConfirm(false)}>
          <div className="w-full max-w-[380px] rounded-[28px] p-10 shadow-2xl text-center"
            style={{ background: "#0f172a", border: "1px solid rgba(239,68,68,0.2)" }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <LogOut className="w-6 h-6 text-red-400" />
            </div>
            <h2 className="text-xl font-black text-white mb-2">Terminate Session?</h2>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              You will be signed out and redirected to the login page. All unsaved data will be cleared.
            </p>
            <div className="flex flex-col gap-3">
              <button onClick={terminateSession}
                className="py-3.5 rounded-xl font-bold text-sm text-white transition-transform duration-200 hover:-translate-y-0.5"
                style={{ background: "#ef4444" }}>
                Yes, Terminate
              </button>
              <button onClick={() => setLogoutConfirm(false)}
                className="py-3.5 rounded-xl font-bold text-sm text-slate-300 hover:text-white transition-colors duration-150"
                style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)" }}>
                Stay Connected
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
