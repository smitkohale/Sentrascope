import { useState } from "react";
import { Link } from "wouter";
import { Lock, EyeOff, Server, ShieldCheck, AlertOctagon, ArrowRight, Building2, Cpu, Database, Wifi, Shield, Menu, X } from "lucide-react";

export function PrivacyPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <>
      <div className="bg-glow" />

      {/* Nav */}
      <nav className="flex justify-between items-center px-4 sm:px-6 py-4 sm:py-5 bg-[#020617]/70 backdrop-blur-md sticky top-0 z-50 border-b border-white/10">
        <Link href="/" className="flex items-center gap-3 font-extrabold text-[1.2rem] sm:text-[1.4rem] text-[#f8fafc] tracking-tight">
          <img src="/logo.svg" alt="Logo" className="w-7 sm:w-8 h-7 sm:h-8 rounded-full object-cover drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]" />
          <span>SentraScope</span>
        </Link>
        <div className="hidden md:flex gap-10 items-center">
          <Link href="/" className="text-[#94a3b8] hover:text-[#f8fafc] text-sm font-medium transition-colors pb-1 border-b-2 border-transparent hover:border-[#38bdf8]">Home</Link>
          <Link href="/about" className="text-[#94a3b8] hover:text-[#f8fafc] text-sm font-medium transition-colors pb-1 border-b-2 border-transparent hover:border-[#38bdf8]">Capabilities</Link>
          <Link href="/privacy" className="text-[#f8fafc] text-sm font-medium drop-shadow-[0_0_8px_rgba(56,189,248,0.5)] border-b-2 border-[#38bdf8] pb-1">Ethics</Link>
          <Link href="/login" className="text-[#94a3b8] hover:text-[#f8fafc] text-sm font-medium transition-colors pb-1 border-b-2 border-transparent hover:border-[#38bdf8]">Sign In</Link>
          <Link href="/signup" className="bg-[#38bdf8] text-black px-6 py-2.5 rounded-xl font-bold text-sm shadow-[0_10px_30px_-10px_rgba(56,189,248,0.5)] hover:-translate-y-1 hover:scale-105 transition-transform duration-200">Get Started</Link>
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
        <div className="md:hidden fixed inset-0 top-[61px] z-40 bg-[#020617]/95 backdrop-blur-md flex flex-col px-6 pt-8 gap-6">
          <Link href="/" onClick={() => setMobileNavOpen(false)} className="text-[#94a3b8] hover:text-[#f8fafc] text-lg font-semibold border-b border-white/10 pb-4 transition-colors">Home</Link>
          <Link href="/about" onClick={() => setMobileNavOpen(false)} className="text-[#94a3b8] hover:text-[#f8fafc] text-lg font-semibold border-b border-white/10 pb-4 transition-colors">Capabilities</Link>
          <Link href="/privacy" onClick={() => setMobileNavOpen(false)} className="text-[#f8fafc] text-lg font-semibold border-b border-white/10 pb-4">Ethics</Link>
          <Link href="/login" onClick={() => setMobileNavOpen(false)} className="text-[#94a3b8] hover:text-[#f8fafc] text-lg font-semibold border-b border-white/10 pb-4 transition-colors">Sign In</Link>
          <Link href="/signup" onClick={() => setMobileNavOpen(false)} className="bg-[#38bdf8] text-black px-6 py-3 rounded-xl font-bold text-base text-center shadow-[0_10px_30px_-10px_rgba(56,189,248,0.5)] transition-transform duration-200 mt-2">Get Started</Link>
        </div>
      )}

      {/* Hero */}
      <div className="max-w-[900px] mx-auto pt-24 pb-10 px-6 text-center">
        <div className="relative w-[200px] h-[200px] mx-auto mb-12 flex items-center justify-center rounded-full border border-[#38bdf8]/30">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: "conic-gradient(from 0deg, transparent 80%, rgba(56,189,248,0.35) 100%)",
              animation: "radarRotate 4s linear infinite",
              willChange: "transform",
            }}
          />
          <ShieldCheck className="w-16 h-16 text-[#38bdf8] relative z-10" style={{ filter: "drop-shadow(0 0 6px rgba(56,189,248,0.4))" }} />
        </div>

        <p className="uppercase tracking-[3px] text-[#38bdf8] font-bold text-sm mb-4">Data Governance</p>
        <h1
          className="font-[850] tracking-[-1.5px] leading-[1.1] mb-6"
          style={{
            fontSize: "clamp(2.6rem, 5vw, 4rem)",
            background: "linear-gradient(135deg, #ffffff 40%, #38bdf8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Privacy &amp; Ethics Framework.
        </h1>
        <p className="text-[#94a3b8] text-[1.1rem] leading-relaxed max-w-[640px] mx-auto">
          SentraScope is built on the principle of transparent environmental intelligence. We monitor the planet, not its people.
        </p>
      </div>

      {/* Content card */}
      <div
        className="max-w-[1000px] mx-auto mb-24 px-6"
        style={{ animation: "fadeInUp 0.8s ease-out" }}
      >

        <div className="bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 rounded-[32px] p-10 md:p-16">

          {/* Zero-liability alert */}
          <div className="bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-2xl p-6 flex gap-5 mb-16">
            <AlertOctagon className="w-16 h-16 text-[#fca5a5] shrink-0 mt-1" />
            <div>
              <h4 className="font-[800] uppercase tracking-wider text-[0.95rem] text-[#fca5a5] mb-3">Zero-Liability Protocol</h4>
              <p className="text-[#fca5a5] text-[0.95rem] leading-relaxed m-0">
                <strong>Data Loss &amp; Attacks:</strong> SentraScope and its affiliates are not responsible for the loss, corruption, or hacking of user data following any targeted cyber-attack, brute-force attempt, or malicious breach.
              </p>
              <p className="text-[#fca5a5] text-[0.95rem] leading-relaxed mt-3 mb-0">
                <strong>User Neglect:</strong> We bear no responsibility for breaches resulting from <strong>user neglect</strong>, including but not limited to: weak password selection, sharing of login credentials, failure to implement multi-factor authentication, or accessing the platform via compromised/unsecured local hardware. By using this platform, you assume full responsibility for your terminal's operational security.
              </p>
            </div>
          </div>

          {/* Section: Secure Telemetry */}
          <section className="mb-14">
            <h2 className="text-[1.7rem] font-[800] text-white mb-5 flex items-center gap-4">
              <Lock className="w-6 h-6 text-[#38bdf8]" style={{ filter: "drop-shadow(0 0 4px rgba(56,189,248,0.3))" }} />
              Secure Telemetry
            </h2>
            <p className="text-[#94a3b8] leading-[1.8] text-[1.05rem] mb-6">
              All data transmitted from our terrestrial IoT sensors is hashed using quantum-resistant algorithms to ensure atmospheric intelligence remains untampered.
            </p>
            <div className="flex flex-wrap gap-3">
              {["AES-256 ENCRYPTION", "TLS 1.3 SECURE TUNNEL", "ZERO-TRUST ARCHITECTURE"].map(b => (
                <span key={b} className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-[0.8rem] text-[#38bdf8] font-mono">{b}</span>
              ))}
            </div>
          </section>

          {/* Section: Anonymized Insights */}
          <section className="mb-14">
            <h2 className="text-[1.7rem] font-[800] text-white mb-5 flex items-center gap-4">
              <EyeOff className="w-6 h-6 text-[#38bdf8]" style={{ filter: "drop-shadow(0 0 4px rgba(56,189,248,0.3))" }} />
              Anonymized Insights
            </h2>
            <p className="text-[#94a3b8] leading-[1.8] text-[1.05rem] mb-6">
              Our satellite thermal mapping utilizes "Civic Masking" technology, preventing the identification of individual households or private activities.
            </p>
            <div className="flex flex-wrap gap-3">
              {["DATA AGGREGATION", "PRIVACY-BY-DESIGN"].map(b => (
                <span key={b} className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-[0.8rem] text-[#38bdf8] font-mono">{b}</span>
              ))}
            </div>
          </section>

          {/* Section: Data Residency */}
          <section className="mb-14">
            <h2 className="text-[1.7rem] font-[800] text-white mb-5 flex items-center gap-4">
              <Server className="w-6 h-6 text-[#38bdf8]" style={{ filter: "drop-shadow(0 0 4px rgba(56,189,248,0.3))" }} />
              Data Residency
            </h2>
            <p className="text-[#94a3b8] leading-[1.8] text-[1.05rem] mb-6">
              All regional data points are stored in sovereign Indian data centers, complying with local governance regulations.
            </p>
            <div className="flex flex-wrap gap-3">
              {["LOCAL CLOUD NODES", "GOVERNANCE COMPLIANT"].map(b => (
                <span key={b} className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-[0.8rem] text-[#38bdf8] font-mono">{b}</span>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="text-center pt-12 border-t border-white/10">
            <p className="text-[#94a3b8] mb-8 text-[1rem]">Ready to explore the data securely?</p>
            <div className="flex justify-center gap-5 flex-wrap items-center">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2.5 bg-[#38bdf8] text-black px-8 py-3.5 rounded-xl font-bold text-sm shadow-[0_10px_30px_-10px_rgba(56,189,248,0.5)] hover:-translate-y-1 hover:scale-[1.02] transition-transform duration-200"
              >
                Launch Secure Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/urbanization"
                className="inline-flex items-center gap-2.5 bg-transparent text-[#ef4444] border border-[#ef4444] px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-[#ef4444] hover:text-white transition-[background-color,color,border-color] duration-200"
              >
                Urbanization
                <Building2 className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Ticker */}
      <div className="bg-[#0f172a]/40 border-y border-white/10 py-4 overflow-hidden whitespace-nowrap flex">
        <div className="inline-flex gap-16 animate-[scroll_40s_linear_infinite] shrink-0 min-w-max pr-16 [will-change:transform]">
          {[
            [Cpu, "Multi-Spectrum Analysis:", "Active"],
            [Database, "Data Nodes:", "Nagpur / Delhi / Mumbai"],
            [Wifi, "IoT Mesh Status:", "Optimized"],
            [Shield, "Encryption:", "AES-256"],
          ].map(([Icon, label, val], i) => (
            <div key={i} className="flex items-center gap-2 font-mono text-sm text-[#94a3b8] uppercase tracking-wider">
              {/* @ts-ignore */}
              <Icon className="w-3.5 h-3.5" /> {label as string} <span className="text-[#38bdf8] font-bold">{val as string}</span>
            </div>
          ))}
        </div>
        <div className="inline-flex gap-16 animate-[scroll_40s_linear_infinite] shrink-0 min-w-max pr-16 [will-change:transform]" aria-hidden>
          {[
            [Cpu, "Multi-Spectrum Analysis:", "Active"],
            [Database, "Data Nodes:", "Nagpur / Delhi / Mumbai"],
            [Wifi, "IoT Mesh Status:", "Optimized"],
            [Shield, "Encryption:", "AES-256"],
          ].map(([Icon, label, val], i) => (
            <div key={i} className="flex items-center gap-2 font-mono text-sm text-[#94a3b8] uppercase tracking-wider">
              {/* @ts-ignore */}
              <Icon className="w-3.5 h-3.5" /> {label as string} <span className="text-[#38bdf8] font-bold">{val as string}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 pt-16 pb-8 px-6 border-t border-white/10 bg-[#020617]/40">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 font-extrabold text-xl text-[#f8fafc] tracking-tight mb-6">
              <img src="/logo.svg" alt="Logo" className="w-8 h-8 rounded-full object-cover" />
              <span>SentraScope</span>
            </div>
            <p className="text-[#94a3b8] max-w-[400px] text-[0.95rem] leading-relaxed">
              Building the sovereign environmental monitoring infrastructure for a climate-resilient India.
            </p>
          </div>
          <div>
            <h4 className="text-white mb-6 font-semibold text-sm">Intelligence</h4>
            <div className="flex flex-col gap-3">
              <Link href="/about" className="text-[#94a3b8] hover:text-[#38bdf8] text-sm transition-colors">About Platform</Link>
              <Link href="/urbanization" className="text-[#94a3b8] hover:text-[#ef4444] text-sm transition-colors">Urbanization Intel</Link>
              <Link href="/dashboard" className="text-[#94a3b8] hover:text-[#38bdf8] text-sm transition-colors">Dashboard</Link>
            </div>
          </div>
          <div>
            <h4 className="text-white mb-6 font-semibold text-sm">Account</h4>
            <div className="flex flex-col gap-3">
              <Link href="/login" className="text-[#94a3b8] hover:text-[#38bdf8] text-sm transition-colors">Sign In</Link>
              <Link href="/signup" className="text-[#94a3b8] hover:text-[#38bdf8] text-sm transition-colors">Get Started</Link>
              <Link href="/privacy" className="text-[#38bdf8] text-sm font-semibold">Data Ethics</Link>
            </div>
          </div>
        </div>
        <div className="max-w-[1200px] mx-auto pt-8 border-t border-white/10 flex justify-between text-xs text-[#94a3b8]">
          <p>&copy; 2026 SentraScope. Engineered in India.</p>
          <p>India</p>
        </div>
      </footer>

    </>
  );
}
