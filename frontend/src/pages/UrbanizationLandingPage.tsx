import { useState } from "react";
import { Link } from "wouter";
import {
  Building2, ArrowRight, Satellite, Activity, Zap, Menu, X,
  ShieldAlert, Eye, Map, TrendingUp, TreePine, Droplets
} from "lucide-react";

export function UrbanizationLandingPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <>
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,#7f1d1d_0%,#050000_70%)] opacity-70" />

      <nav className="flex justify-between items-center px-4 sm:px-6 py-4 sm:py-5 bg-[#050000]/80 backdrop-blur-md sticky top-0 z-50 border-b border-[#ef4444]/20">
        <Link href="/" className="flex items-center gap-3 font-extrabold text-[1.2rem] sm:text-[1.4rem] text-[#f8fafc] tracking-tight">
          <img src="/logo.svg" alt="Logo" className="w-7 sm:w-8 h-7 sm:h-8 rounded-full object-cover drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
          <span>SentraScope</span>
        </Link>

        <div className="hidden md:flex gap-8 lg:gap-10 items-center">
          <Link href="/" className="text-[#94a3b8] hover:text-[#f8fafc] text-sm font-medium transition-colors pb-1 border-b-2 border-transparent hover:border-[#ef4444]">Home</Link>
          <Link href="/urbanization" className="text-[#f8fafc] text-sm font-medium drop-shadow-[0_0_8px_rgba(239,68,68,0.5)] border-b-2 border-[#ef4444] pb-1">Urbanization</Link>
          <Link href="/about" className="text-[#94a3b8] hover:text-[#f8fafc] text-sm font-medium transition-colors pb-1 border-b-2 border-transparent hover:border-[#ef4444]">Capabilities</Link>
          <Link href="/login" className="text-[#94a3b8] hover:text-[#f8fafc] text-sm font-medium transition-colors pb-1 border-b-2 border-transparent hover:border-[#ef4444]">Sign In</Link>
          <Link href="/signup" className="bg-[#ef4444] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-[0_10px_30px_-10px_rgba(239,68,68,0.5)] hover:-translate-y-1 hover:scale-105 transition-transform duration-200">Get Started</Link>
        </div>

        <button
          onClick={() => setMobileNavOpen(o => !o)}
          className="md:hidden p-2 text-[#f8fafc] hover:text-[#ef4444] transition-colors"
          aria-label="Toggle menu"
        >
          {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {mobileNavOpen && (
        <div className="md:hidden fixed inset-0 top-[61px] z-40 bg-[#050000]/97 backdrop-blur-md flex flex-col px-6 pt-8 gap-6 animate-in fade-in slide-in-from-top-2 duration-200">
          <Link href="/" onClick={() => setMobileNavOpen(false)} className="text-[#94a3b8] hover:text-[#f8fafc] text-lg font-semibold border-b border-white/10 pb-4 transition-colors">Home</Link>
          <Link href="/urbanization" onClick={() => setMobileNavOpen(false)} className="text-[#f8fafc] text-lg font-semibold border-b border-white/10 pb-4">Urbanization</Link>
          <Link href="/about" onClick={() => setMobileNavOpen(false)} className="text-[#94a3b8] hover:text-[#f8fafc] text-lg font-semibold border-b border-white/10 pb-4 transition-colors">Capabilities</Link>
          <Link href="/login" onClick={() => setMobileNavOpen(false)} className="text-[#94a3b8] hover:text-[#f8fafc] text-lg font-semibold border-b border-white/10 pb-4 transition-colors">Sign In</Link>
          <Link href="/signup" onClick={() => setMobileNavOpen(false)} className="bg-[#ef4444] text-white px-6 py-3 rounded-xl font-bold text-base text-center shadow-[0_10px_30px_-10px_rgba(239,68,68,0.5)] transition-transform duration-200 mt-2">Get Started</Link>
        </div>
      )}

      <main className="relative z-10">
        <section className="pt-20 sm:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 text-center max-w-[1100px] mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#ef4444]/10 text-[#ef4444] px-4 py-1.5 rounded-full text-xs font-semibold mb-6 sm:mb-8 border border-[#ef4444]/20 animate-[float_4s_ease-in-out_infinite] [will-change:transform]">
            <Satellite className="w-3.5 h-3.5" />
            Sentinel-2 Early Warning System · Live
          </div>
          <h1 className="text-[clamp(2rem,8vw,5rem)] leading-none mb-6 sm:mb-8 font-[850] tracking-[-2px] bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-[#ef4444]">
            Unauthorized Expansion,<br />
            <span className="text-[#ef4444]">Detected Before It Spreads.</span>
          </h1>
          <p className="text-[#94a3b8] text-base sm:text-xl mb-8 sm:mb-12 max-w-[750px] mx-auto leading-relaxed">
            SentraScope's Urbanization Intelligence module uses high-resolution Sentinel-2 satellite imagery and NDBI analysis to detect, quantify, and flag unauthorized urban expansion — giving authorities actionable early-warning intelligence across India.
          </p>

          <div className="flex gap-3 sm:gap-4 justify-center flex-wrap">
            <Link
              href="/urbanization/dashboard"
              className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 bg-[#ef4444] text-white rounded-xl font-bold text-sm sm:text-[0.95rem] shadow-[0_10px_30px_-10px_rgba(239,68,68,0.5)] hover:-translate-y-1 hover:scale-105 transition-transform duration-200"
            >
              Launch Urbanization
              <ArrowRight className="w-[16px] sm:w-[18px] h-[16px] sm:h-[18px]" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 bg-transparent text-white border border-white/10 rounded-xl font-bold text-sm sm:text-[0.95rem] hover:bg-white/5 hover:border-[#94a3b8] transition-[border-color,background-color] duration-200"
            >
              Platform Overview
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 bg-[#38bdf8]/10 text-white border border-[#38bdf8]/30 rounded-xl font-bold text-sm sm:text-[0.95rem] hover:bg-[#38bdf8]/20 hover:border-[#38bdf8] hover:-translate-y-1 transition-[transform,border-color,background-color] duration-200"
            >
              <Activity className="w-[16px] sm:w-[18px] h-[16px] sm:h-[18px] text-[#38bdf8]" />
              Dashboard
            </Link>
          </div>
        </section>

        <div className="bg-[#0f0505]/60 border-y border-[#ef4444]/10 py-3 sm:py-4 mt-10 sm:mt-16 overflow-hidden whitespace-nowrap flex">
          <div className="inline-flex gap-10 sm:gap-16 animate-[scroll_30s_linear_infinite] shrink-0 min-w-max pr-10 sm:pr-16 [will-change:transform]">
            <div className="flex items-center gap-2 font-mono text-xs sm:text-sm text-[#94a3b8]"><Building2 className="w-3.5 h-3.5 text-[#ef4444]" /> New Built-up Area (2022–25): <span className="text-[#ef4444] font-bold">12.47 km²</span></div>
            <div className="flex items-center gap-2 font-mono text-xs sm:text-sm text-[#94a3b8]"><Satellite className="w-3.5 h-3.5 text-[#ef4444]" /> Sentinel-2 Resolution: <span className="text-[#ef4444] font-bold">10–30m</span></div>
            <div className="flex items-center gap-2 font-mono text-xs sm:text-sm text-[#94a3b8]"><ShieldAlert className="w-3.5 h-3.5 text-[#ef4444]" /> Illegal Encroachment Flagged: <span className="text-[#ef4444] font-bold">2.34 km²</span></div>
            <div className="flex items-center gap-2 font-mono text-xs sm:text-sm text-[#94a3b8]"><TrendingUp className="w-3.5 h-3.5 text-[#ef4444]" /> NDBI Change (Nagpur): <span className="text-[#ef4444] font-bold">+53.6%</span></div>
          </div>
          <div className="inline-flex gap-10 sm:gap-16 animate-[scroll_30s_linear_infinite] shrink-0 min-w-max pr-10 sm:pr-16 [will-change:transform]" aria-hidden>
            <div className="flex items-center gap-2 font-mono text-xs sm:text-sm text-[#94a3b8]"><Building2 className="w-3.5 h-3.5 text-[#ef4444]" /> New Built-up Area (2022–25): <span className="text-[#ef4444] font-bold">12.47 km²</span></div>
            <div className="flex items-center gap-2 font-mono text-xs sm:text-sm text-[#94a3b8]"><Satellite className="w-3.5 h-3.5 text-[#ef4444]" /> Sentinel-2 Resolution: <span className="text-[#ef4444] font-bold">10–30m</span></div>
            <div className="flex items-center gap-2 font-mono text-xs sm:text-sm text-[#94a3b8]"><ShieldAlert className="w-3.5 h-3.5 text-[#ef4444]" /> Illegal Encroachment Flagged: <span className="text-[#ef4444] font-bold">2.34 km²</span></div>
            <div className="flex items-center gap-2 font-mono text-xs sm:text-sm text-[#94a3b8]"><TrendingUp className="w-3.5 h-3.5 text-[#ef4444]" /> NDBI Change (Nagpur): <span className="text-[#ef4444] font-bold">+53.6%</span></div>
          </div>
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 py-12 sm:py-16 px-4 sm:px-6 max-w-[1200px] mx-auto">
          <div className="bg-[#1c0707]/60 backdrop-blur-md border border-[#ef4444]/20 p-6 sm:p-8 rounded-3xl transition-[transform,border-color] duration-300 hover:border-[#ef4444] hover:-translate-y-2 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="text-[#ef4444] bg-[#ef4444]/10 w-11 sm:w-12 h-11 sm:h-12 flex items-center justify-center rounded-xl mb-5 sm:mb-6">
              <Satellite />
            </div>
            <span className="text-4xl sm:text-5xl font-[800] block mb-2 tracking-tight">12.47</span>
            <span className="text-[#94a3b8] text-sm uppercase tracking-wider font-semibold">km² Urban Expansion Detected</span>
          </div>
          <div className="bg-[#1c0707]/60 backdrop-blur-md border border-[#ef4444]/20 p-6 sm:p-8 rounded-3xl transition-[transform,border-color] duration-300 hover:border-[#ef4444] hover:-translate-y-2 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="text-[#ef4444] bg-[#ef4444]/10 w-11 sm:w-12 h-11 sm:h-12 flex items-center justify-center rounded-xl mb-5 sm:mb-6">
              <Eye />
            </div>
            <span className="text-4xl sm:text-5xl font-[800] block mb-2 tracking-tight">78.4%</span>
            <span className="text-[#94a3b8] text-sm uppercase tracking-wider font-semibold">NDBI Classification Accuracy</span>
          </div>
          <div className="bg-[#1c0707]/60 backdrop-blur-md border border-[#ef4444]/20 p-6 sm:p-8 rounded-3xl transition-[transform,border-color] duration-300 hover:border-[#ef4444] hover:-translate-y-2 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="text-[#ef4444] bg-[#ef4444]/10 w-11 sm:w-12 h-11 sm:h-12 flex items-center justify-center rounded-xl mb-5 sm:mb-6">
              <ShieldAlert />
            </div>
            <span className="text-4xl sm:text-5xl font-[800] block mb-2 tracking-tight">2.34</span>
            <span className="text-[#94a3b8] text-sm uppercase tracking-wider font-semibold">km² Illegal Encroachment Flagged</span>
          </div>
        </section>

        <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-[1200px] mx-auto">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-[clamp(1.5rem,4vw,2.5rem)] font-[800] tracking-tight text-white mb-3">
              What the Intelligence Module Covers
            </h2>
            <p className="text-[#94a3b8] max-w-[600px] mx-auto text-base">
              A complete satellite-driven pipeline — from image acquisition to ground-truth alerting.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              { icon: Satellite, title: "Sentinel-2 Acquisition", desc: "Cloud-masked SR composites from ESA's Sentinel-2 constellation at 10–30m resolution across selectable time windows." },
              { icon: Map, title: "NDBI Change Detection", desc: "Normalized Difference Built-up Index computed per time period, with temporal differencing to isolate genuine expansion from noise." },
              { icon: TreePine, title: "Illegal Encroachment", desc: "Google Dynamic World V1 identifies protected land (water bodies, forests). Overlapping expansion is automatically flagged as illegal buildup." },
              { icon: Activity, title: "Interactive Analysis", desc: "Configurable date range picker and sensitivity slider let you run custom analyses over any baseline-to-recent window since 2015." },
              { icon: TrendingUp, title: "Area Quantification", desc: "Pixel-level area computation at 200m scale converts expansion masks to precise square kilometer measurements." },
              { icon: Zap, title: "Real-time Alerts", desc: "Zone-level breakdowns with automatic severity scoring across Nagpur's known high-risk corridors and protected buffer zones." },
            ].map((f) => (
              <div key={f.title} className="bg-[#1c0707]/50 border border-[#ef4444]/15 rounded-2xl p-5 sm:p-6 hover:border-[#ef4444]/40 hover:-translate-y-1 transition-[transform,border-color] duration-300 group">
                <div className="text-[#ef4444] bg-[#ef4444]/10 w-10 h-10 flex items-center justify-center rounded-xl mb-4 group-hover:bg-[#ef4444]/20 transition-colors">
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="text-white font-bold text-base mb-2">{f.title}</h3>
                <p className="text-[#94a3b8] text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-[900px] mx-auto text-center">
          <div className="bg-[#1c0707]/70 border border-[#ef4444]/25 rounded-3xl p-8 sm:p-12 backdrop-blur-xl shadow-[0_20px_60px_rgba(239,68,68,0.1)]">
            <div className="inline-flex items-center gap-2 bg-[#ef4444]/10 text-[#ef4444] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-[#ef4444]/20 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-pulse" />
              System Ready
            </div>
            <h2 className="text-[clamp(1.5rem,4vw,2.5rem)] font-[850] tracking-tight text-white mb-4">
              Access Urbanization Intelligence
            </h2>
            <p className="text-[#94a3b8] text-base sm:text-lg mb-8 max-w-[600px] mx-auto leading-relaxed">
              Sign in with your SentraScope credentials to access the full satellite analysis dashboard — interactive maps, NDBI trend charts, and illegal encroachment detection.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/urbanization/dashboard"
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#ef4444] text-white rounded-xl font-bold text-[0.95rem] shadow-[0_10px_30px_-10px_rgba(239,68,68,0.5)] hover:-translate-y-1 hover:scale-105 transition-transform duration-200"
              >
                Launch Urbanization
                <ArrowRight className="w-[18px] h-[18px]" />
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-transparent text-white border border-white/15 rounded-xl font-bold text-[0.95rem] hover:bg-white/5 hover:border-[#94a3b8] transition-[border-color,background-color] duration-200"
              >
                Create Account
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-8 sm:mt-16 pt-12 sm:pt-16 pb-8 px-4 sm:px-6 border-t border-[#ef4444]/10 bg-[#050000]/60 relative z-10">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 md:gap-16 mb-10 sm:mb-16">
          <div className="sm:col-span-2">
            <div className="flex items-center gap-3 font-extrabold text-xl text-[#f8fafc] tracking-tight mb-4 sm:mb-6">
              <img src="/logo.svg" alt="Logo" className="w-8 h-8 rounded-full object-cover" />
              <span>SentraScope</span>
            </div>
            <p className="text-[#94a3b8] max-w-[400px] text-[0.95rem] leading-relaxed">
              Satellite-powered early warning for unauthorized urban expansion — protecting India's protected zones, forests, and water bodies.
            </p>
          </div>
          <div>
            <h4 className="text-white mb-4 sm:mb-6 font-semibold text-sm">Intelligence</h4>
            <div className="flex flex-col gap-3">
              <Link href="/" className="text-[#94a3b8] hover:text-[#38bdf8] text-sm transition-colors">SentraScope Home</Link>
              <Link href="/urbanization/dashboard" className="text-[#94a3b8] hover:text-[#ef4444] text-sm transition-colors">Urbanization Dashboard</Link>
              <Link href="/about" className="text-[#94a3b8] hover:text-[#38bdf8] text-sm transition-colors">Platform Capabilities</Link>
            </div>
          </div>
          <div>
            <h4 className="text-white mb-4 sm:mb-6 font-semibold text-sm">Account</h4>
            <div className="flex flex-col gap-3">
              <Link href="/login" className="text-[#94a3b8] hover:text-[#38bdf8] text-sm transition-colors">Sign In</Link>
              <Link href="/signup" className="text-[#94a3b8] hover:text-[#38bdf8] text-sm transition-colors">Register</Link>
              <Link href="/privacy" className="text-[#94a3b8] hover:text-[#38bdf8] text-sm transition-colors">Data Ethics</Link>
            </div>
          </div>
        </div>
        <div className="max-w-[1200px] mx-auto pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-2 text-xs text-[#94a3b8]">
          <p>&copy; 2026 SentraScope · Urbanization Intelligence Module. Engineered in India.</p>
          <p>Nagpur, Maharashtra</p>
        </div>
      </footer>

    </>
  );
}
