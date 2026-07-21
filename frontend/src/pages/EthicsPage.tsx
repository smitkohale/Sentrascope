import { useState } from "react";
import { Link } from "wouter";
import { ShieldCheck, Lock, EyeOff, Server, AlertOctagon, ArrowRight, Building2, Menu, X } from "lucide-react";

function Badge({ text }: { text: string }) {
  return (
    <span className="inline-block px-3 py-1.5 rounded-full text-[11px] font-mono font-bold"
      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#38bdf8" }}>
      {text}
    </span>
  );
}

export function EthicsPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen text-[#f8fafc]" style={{ background: "#020617", fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: "radial-gradient(circle at 80% 20%, #1e293b 0%, transparent 40%), radial-gradient(circle at 20% 80%, #0c4a6e 0%, transparent 30%)",
        opacity: 0.4, zIndex: 0
      }} />

      {/* Nav */}
      <nav className="flex justify-between items-center px-[5%] py-5 sticky top-0 z-50"
        style={{ background: "rgba(2,6,23,0.7)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <Link href="/" className="flex items-center gap-3 font-black text-[1.3rem] text-white no-underline tracking-tight">
          <img src="/logo.svg" alt="Logo" className="w-8 h-8 rounded-lg object-cover"
            style={{ filter: "drop-shadow(0 0 3px rgba(56,189,248,0.4)) drop-shadow(0 0 10px rgba(56,189,248,0.2))" }} />
          <span>SentraScope</span>
        </Link>
        <div className="hidden md:flex items-center gap-10">
          {[
            { href: "/",        label: "Home" },
            { href: "/about",   label: "Capabilities" },
            { href: "/privacy", label: "Ethics", active: true },
            { href: "/login",   label: "Sign In" },
          ].map(l => (
            <Link key={l.href} href={l.href}
              className={`no-underline text-[0.9rem] font-medium transition-colors relative pb-1 ${l.active ? "text-white" : "text-[#94a3b8] hover:text-white"}`}
              style={l.active ? { textShadow: "0 0 8px rgba(56,189,248,0.4)" } : {}}>
              {l.label}
              {l.active && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-full rounded-full"
                  style={{ background: "#38bdf8" }} />
              )}
            </Link>
          ))}
          <Link href="/signup"
            className="no-underline px-5 py-2 rounded-xl text-[0.85rem] font-bold transition-transform duration-200 hover:-translate-y-0.5"
            style={{ background: "#38bdf8", color: "#000", boxShadow: "0 10px 30px -10px rgba(56,189,248,0.5)" }}>
            Get Started
          </Link>
        </div>
        <button
          onClick={() => setMobileNavOpen(o => !o)}
          className="md:hidden p-2 text-[#f8fafc] hover:text-[#38bdf8] transition-colors"
          aria-label="Toggle menu"
        >
          {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {mobileNavOpen && (
        <div className="md:hidden fixed inset-0 top-[69px] z-40 bg-[#020617]/95 backdrop-blur-md flex flex-col px-6 pt-8 gap-6 animate-in fade-in slide-in-from-top-2 duration-200">
          <Link href="/" onClick={() => setMobileNavOpen(false)} className="text-[#94a3b8] hover:text-[#f8fafc] text-lg font-semibold border-b border-white/10 pb-4 transition-colors">Home</Link>
          <Link href="/about" onClick={() => setMobileNavOpen(false)} className="text-[#94a3b8] hover:text-[#f8fafc] text-lg font-semibold border-b border-white/10 pb-4 transition-colors">Capabilities</Link>
          <Link href="/privacy" onClick={() => setMobileNavOpen(false)} className="text-[#f8fafc] text-lg font-semibold border-b border-white/10 pb-4">Ethics</Link>
          <Link href="/login" onClick={() => setMobileNavOpen(false)} className="text-[#94a3b8] hover:text-[#f8fafc] text-lg font-semibold border-b border-white/10 pb-4 transition-colors">Sign In</Link>
          <Link href="/signup" onClick={() => setMobileNavOpen(false)} className="bg-[#38bdf8] text-black px-6 py-3 rounded-xl font-bold text-base text-center shadow-[0_10px_30px_-10px_rgba(56,189,248,0.5)] transition-transform duration-200 mt-2">Get Started</Link>
        </div>
      )}

      {/* Hero */}
      <section className="relative z-10 pt-28 pb-14 text-center max-w-[900px] mx-auto px-6">
        {/* Radar animation */}
        <div className="w-48 h-48 mx-auto mb-12 relative flex items-center justify-center rounded-full"
          style={{ border: "1px solid rgba(56,189,248,0.3)" }}>
          <div className="absolute inset-0 rounded-full"
            style={{
              background: "conic-gradient(from 0deg, transparent 80%, rgba(56,189,248,0.4) 100%)",
              animation: "spinRadar 4s linear infinite",
              willChange: "transform",
            }} />
          {[1, 2, 3].map(i => (
            <div key={i} className="absolute inset-0 rounded-full"
              style={{ border: "1px solid rgba(56,189,248,0.12)", transform: `scale(${0.33 * i})` }} />
          ))}
          <ShieldCheck className="w-14 h-14 relative z-10" style={{ color: "#38bdf8", filter: "drop-shadow(0 0 4px rgba(56,189,248,0.5))" }} />
        </div>

        <p className="uppercase tracking-[3px] text-[0.8rem] font-bold mb-4" style={{ color: "#38bdf8" }}>
          Data Governance
        </p>
        <h1 className="text-[clamp(2.6rem,5vw,4rem)] font-black mb-6 leading-tight"
          style={{ letterSpacing: "-1.5px", background: "linear-gradient(135deg, #ffffff 40%, #38bdf8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Privacy & Ethics Framework.
        </h1>
        <p className="text-[1.1rem] text-[#94a3b8] max-w-[600px] mx-auto leading-relaxed">
          SentraScope is built on the principle of transparent environmental intelligence. We monitor the planet, not its people.
        </p>
      </section>

      {/* Content Card */}
      <div className="relative z-10 max-w-[960px] mx-auto mb-28 px-6"
        style={{ animation: "fadeInUp 0.8s ease-out" }}>
        <div className="rounded-[32px] p-14"
          style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)" }}>

          {/* Zero-Liability Alert */}
          <div className="flex gap-5 p-6 rounded-2xl mb-14"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
            <AlertOctagon className="w-16 h-16 shrink-0 text-red-400 mt-0.5" />
            <div>
              <h4 className="text-[0.9rem] font-black uppercase tracking-[1px] text-red-300 mb-2">Zero-Liability Protocol</h4>
              <p className="text-[0.95rem] leading-relaxed text-red-200 m-0">
                <strong>Data Loss & Attacks:</strong> SentraScope and its affiliates are not responsible for the loss, corruption, or hacking of user data following any targeted cyber-attack, brute-force attempt, or malicious breach.
                <br /><br />
                <strong>User Neglect:</strong> We bear no responsibility for breaches resulting from <strong>user neglect</strong>, including but not limited to: weak password selection, sharing of login credentials, failure to implement multi-factor authentication, or accessing the platform via compromised/unsecured local hardware. By using this platform, you assume full responsibility for your terminal's operational security.
              </p>
            </div>
          </div>

          {/* Section: Secure Telemetry */}
          <section className="mb-14">
            <h2 className="text-[1.7rem] font-black flex items-center gap-4 mb-5 text-white">
              <Lock className="w-6 h-6 shrink-0" style={{ color: "#38bdf8", filter: "drop-shadow(0 0 4px rgba(56,189,248,0.3))" }} />
              Secure Telemetry
            </h2>
            <p className="text-[1.05rem] text-[#94a3b8] leading-[1.8] mb-5">
              All data transmitted from our terrestrial IoT sensors is hashed using quantum-resistant algorithms to ensure atmospheric intelligence remains untampered.
            </p>
            <div className="flex flex-wrap gap-3">
              {["AES-256 ENCRYPTION", "TLS 1.3 SECURE TUNNEL", "ZERO-TRUST ARCHITECTURE"].map(b => <Badge key={b} text={b} />)}
            </div>
          </section>

          {/* Section: Anonymized Insights */}
          <section className="mb-14">
            <h2 className="text-[1.7rem] font-black flex items-center gap-4 mb-5 text-white">
              <EyeOff className="w-6 h-6 shrink-0" style={{ color: "#38bdf8", filter: "drop-shadow(0 0 4px rgba(56,189,248,0.3))" }} />
              Anonymized Insights
            </h2>
            <p className="text-[1.05rem] text-[#94a3b8] leading-[1.8] mb-5">
              Our satellite thermal mapping utilizes "Civic Masking" technology, preventing the identification of individual households or private activities.
            </p>
            <div className="flex flex-wrap gap-3">
              {["DATA AGGREGATION", "PRIVACY-BY-DESIGN"].map(b => <Badge key={b} text={b} />)}
            </div>
          </section>

          {/* Section: Data Residency */}
          <section className="mb-0">
            <h2 className="text-[1.7rem] font-black flex items-center gap-4 mb-5 text-white">
              <Server className="w-6 h-6 shrink-0" style={{ color: "#38bdf8", filter: "drop-shadow(0 0 4px rgba(56,189,248,0.3))" }} />
              Data Residency
            </h2>
            <p className="text-[1.05rem] text-[#94a3b8] leading-[1.8] mb-5">
              All regional data points are stored in sovereign Indian data centers, complying with local governance regulations.
            </p>
            <div className="flex flex-wrap gap-3">
              {["LOCAL CLOUD NODES", "GOVERNANCE COMPLIANT"].map(b => <Badge key={b} text={b} />)}
            </div>
          </section>

          {/* CTA */}
          <div className="text-center mt-20 pt-10" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <p className="text-[#94a3b8] text-[1.05rem] mb-8">Ready to explore the data securely?</p>
            <div className="flex flex-wrap justify-center gap-5 items-center">
              <Link href="/signup"
                className="no-underline inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-bold transition-transform duration-200 hover:-translate-y-0.5"
                style={{ background: "#38bdf8", color: "#000", boxShadow: "0 10px 30px -10px rgba(56,189,248,0.5)" }}>
                Launch Secure Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/urbanization"
                className="no-underline inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-bold transition-[background-color,color,border-color] duration-200 hover:bg-red-500 hover:text-white"
                style={{ background: "transparent", color: "#ef4444", border: "1px solid #ef4444" }}>
                Urbanization <Building2 className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 px-[5%] pt-20 pb-10"
        style={{ background: "rgba(2,6,23,0.8)", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12 max-w-[960px] mx-auto">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-3 no-underline mb-4">
              <img src="/logo.svg" alt="" className="w-8 h-8 rounded-lg object-cover" />
              <span className="font-black text-white text-lg tracking-tight">SentraScope</span>
            </Link>
            <p className="text-[#94a3b8] text-[0.9rem] leading-relaxed max-w-[360px]">
              Building the sovereign environmental monitoring infrastructure for a climate-resilient India.
            </p>
          </div>
          <div>
            <h4 className="text-white text-[0.9rem] font-bold mb-4">Intelligence</h4>
            <div className="flex flex-col gap-3">
              <Link href="/about" className="text-[#94a3b8] no-underline text-[0.9rem] hover:text-white transition-colors">About Platform</Link>
              <Link href="/urbanization" className="text-[#94a3b8] no-underline text-[0.9rem] hover:text-[#ef4444] transition-colors">Urbanization Intel</Link>
              <Link href="/dashboard" className="text-[#94a3b8] no-underline text-[0.9rem] hover:text-white transition-colors">Dashboard</Link>
            </div>
          </div>
          <div>
            <h4 className="text-white text-[0.9rem] font-bold mb-4">Account</h4>
            <div className="flex flex-col gap-3">
              <Link href="/login" className="text-[#94a3b8] no-underline text-[0.9rem] hover:text-white transition-colors">Sign In</Link>
              <Link href="/signup" className="text-[#94a3b8] no-underline text-[0.9rem] hover:text-white transition-colors">Get Started</Link>
              <Link href="/privacy" className="text-sky-400 no-underline text-[0.9rem] font-semibold">Data Ethics</Link>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center text-[0.8rem] text-[#94a3b8] max-w-[960px] mx-auto"
          style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "1.5rem" }}>
          <p className="m-0">© 2026 SentraScope. Engineered in India.</p>
          <p className="m-0">India</p>
        </div>
      </footer>

    </div>
  );
}
