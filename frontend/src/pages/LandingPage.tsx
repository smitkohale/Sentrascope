import { useState } from "react";
import { Link } from "wouter";
import { ShieldCheck, ArrowRight, Building2, Wind, ThermometerSun, Trees, Droplets, Satellite, Activity, Zap, Menu, X } from "lucide-react";

const Logo = "/logo.svg";

export function LandingPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <>
      <div className="bg-glow" />
      
      <nav className="flex justify-between items-center px-4 sm:px-6 py-4 sm:py-5 bg-[#020617]/70 backdrop-blur-md sticky top-0 z-50 border-b border-white/10">
        <Link href="/" className="flex items-center gap-3 font-extrabold text-[1.2rem] sm:text-[1.4rem] text-[#f8fafc] tracking-tight">
          <img src={Logo} alt="Logo" className="w-7 sm:w-8 h-7 sm:h-8 rounded-full object-cover drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]" />
          <span>SentraScope</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-8 lg:gap-10 items-center">
          <Link href="/" className="text-[#f8fafc] text-sm font-medium drop-shadow-[0_0_8px_rgba(56,189,248,0.5)] border-b-2 border-[#38bdf8] pb-1">Home</Link>
          <Link href="/about" className="text-[#94a3b8] hover:text-[#f8fafc] text-sm font-medium transition-colors pb-1 border-b-2 border-transparent hover:border-[#38bdf8]">Capabilities</Link>
          <Link href="/privacy" className="text-[#94a3b8] hover:text-[#f8fafc] text-sm font-medium transition-colors pb-1 border-b-2 border-transparent hover:border-[#38bdf8]">Ethics</Link>
          <Link href="/login" className="text-[#94a3b8] hover:text-[#f8fafc] text-sm font-medium transition-colors pb-1 border-b-2 border-transparent hover:border-[#38bdf8]">Sign In</Link>
          <Link href="/signup" className="bg-[#38bdf8] text-black px-5 py-2.5 rounded-xl font-bold text-sm shadow-[0_10px_30px_-10px_rgba(56,189,248,0.5)] hover:-translate-y-1 hover:scale-105 transition-transform duration-200">Get Started</Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileNavOpen(o => !o)}
          className="md:hidden p-2 text-[#f8fafc] hover:text-[#38bdf8] transition-colors"
          aria-label="Toggle menu"
        >
          {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile nav drawer */}
      {mobileNavOpen && (
        <div className="md:hidden fixed inset-0 top-[61px] z-40 bg-[#020617]/95 backdrop-blur-md flex flex-col px-6 pt-8 gap-6 animate-in fade-in slide-in-from-top-2 duration-200">
          <Link href="/" onClick={() => setMobileNavOpen(false)} className="text-[#f8fafc] text-lg font-semibold border-b border-white/10 pb-4">Home</Link>
          <Link href="/about" onClick={() => setMobileNavOpen(false)} className="text-[#94a3b8] hover:text-[#f8fafc] text-lg font-semibold border-b border-white/10 pb-4 transition-colors">Capabilities</Link>
          <Link href="/privacy" onClick={() => setMobileNavOpen(false)} className="text-[#94a3b8] hover:text-[#f8fafc] text-lg font-semibold border-b border-white/10 pb-4 transition-colors">Ethics</Link>
          <Link href="/login" onClick={() => setMobileNavOpen(false)} className="text-[#94a3b8] hover:text-[#f8fafc] text-lg font-semibold border-b border-white/10 pb-4 transition-colors">Sign In</Link>
          <Link href="/signup" onClick={() => setMobileNavOpen(false)} className="bg-[#38bdf8] text-black px-6 py-3 rounded-xl font-bold text-base text-center shadow-[0_10px_30px_-10px_rgba(56,189,248,0.5)] transition-transform duration-200 mt-2">Get Started</Link>
        </div>
      )}

      <main>
        <section className="pt-20 sm:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 text-center max-w-[1100px] mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#38bdf8]/10 text-[#38bdf8] px-4 py-1.5 rounded-full text-xs font-semibold mb-6 sm:mb-8 border border-[#38bdf8]/20 animate-[float_4s_ease-in-out_infinite] [will-change:transform]">
            <ShieldCheck className="w-3.5 h-3.5" />
            V1.2 Intelligence Engine Live
          </div>
          <h1 className="text-[clamp(2rem,8vw,5rem)] leading-none mb-6 sm:mb-8 font-[850] tracking-[-2px] bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-[#38bdf8]">
            Environmental Data,<br />
            <span className="text-[#38bdf8]">Deciphered in Real-time.</span>
          </h1>
          <p className="text-[#94a3b8] text-base sm:text-xl mb-8 sm:mb-12 max-w-[750px] mx-auto leading-relaxed">
            From Himalayan air currents to the Western Ghats' canopy, SentraScope provides the high-fidelity ecological intelligence required to protect India's future.
          </p>
          
          <div className="flex gap-3 sm:gap-4 justify-center flex-wrap">
            <Link href="/dashboard" className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 bg-[#38bdf8] text-black rounded-xl font-bold text-sm sm:text-[0.95rem] shadow-[0_10px_30px_-10px_rgba(56,189,248,0.5)] hover:-translate-y-1 hover:scale-105 transition-transform duration-200">
              Launch Dashboard
              <ArrowRight className="w-[16px] sm:w-[18px] h-[16px] sm:h-[18px]" />
            </Link>
            <Link href="/about" className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 bg-transparent text-white border border-white/10 rounded-xl font-bold text-sm sm:text-[0.95rem] hover:bg-white/5 hover:border-[#94a3b8] transition-[border-color,background-color] duration-200">
              Platform Overview
            </Link>
            <Link href="/urbanization" className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 bg-[#ef4444]/10 text-white border border-[#ef4444]/30 rounded-xl font-bold text-sm sm:text-[0.95rem] hover:bg-[#ef4444]/25 hover:border-[#ef4444] hover:-translate-y-1 transition-[transform,border-color,background-color] duration-200">
              <Building2 className="w-[16px] sm:w-[18px] h-[16px] sm:h-[18px] text-[#ef4444]" />
              Urbanization
            </Link>
          </div>
        </section>

        <div className="bg-[#0f172a]/40 border-y border-white/10 py-3 sm:py-4 mt-10 sm:mt-16 overflow-hidden whitespace-nowrap flex">
          <div className="inline-flex gap-10 sm:gap-16 animate-[scroll_30s_linear_infinite] shrink-0 min-w-max pr-10 sm:pr-16 [will-change:transform]">
            <div className="flex items-center gap-2 font-mono text-xs sm:text-sm text-[#94a3b8]"><Wind className="w-3.5 h-3.5" /> AQI Mumbai: <span className="text-[#38bdf8] font-bold">142 (Moderate)</span></div>
            <div className="flex items-center gap-2 font-mono text-xs sm:text-sm text-[#94a3b8]"><ThermometerSun className="w-3.5 h-3.5" /> Heat Index Nagpur: <span className="text-[#38bdf8] font-bold">38°C</span></div>
            <div className="flex items-center gap-2 font-mono text-xs sm:text-sm text-[#94a3b8]"><Trees className="w-3.5 h-3.5" /> Canopy Change: <span className="text-[#38bdf8] font-bold">-0.02% (Alert)</span></div>
            <div className="flex items-center gap-2 font-mono text-xs sm:text-sm text-[#94a3b8]"><Droplets className="w-3.5 h-3.5" /> Humidity Delhi: <span className="text-[#38bdf8] font-bold">45%</span></div>
          </div>
          <div className="inline-flex gap-10 sm:gap-16 animate-[scroll_30s_linear_infinite] shrink-0 min-w-max pr-10 sm:pr-16 [will-change:transform]" aria-hidden>
            <div className="flex items-center gap-2 font-mono text-xs sm:text-sm text-[#94a3b8]"><Wind className="w-3.5 h-3.5" /> AQI Mumbai: <span className="text-[#38bdf8] font-bold">142 (Moderate)</span></div>
            <div className="flex items-center gap-2 font-mono text-xs sm:text-sm text-[#94a3b8]"><ThermometerSun className="w-3.5 h-3.5" /> Heat Index Nagpur: <span className="text-[#38bdf8] font-bold">38°C</span></div>
            <div className="flex items-center gap-2 font-mono text-xs sm:text-sm text-[#94a3b8]"><Trees className="w-3.5 h-3.5" /> Canopy Change: <span className="text-[#38bdf8] font-bold">-0.02% (Alert)</span></div>
            <div className="flex items-center gap-2 font-mono text-xs sm:text-sm text-[#94a3b8]"><Droplets className="w-3.5 h-3.5" /> Humidity Delhi: <span className="text-[#38bdf8] font-bold">45%</span></div>
          </div>
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 py-12 sm:py-16 px-4 sm:px-6 max-w-[1200px] mx-auto">
          <div className="bg-[#0f172a]/60 backdrop-blur-md border border-white/10 p-6 sm:p-8 rounded-3xl transition-[transform,border-color] duration-300 hover:border-[#38bdf8] hover:-translate-y-2 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="text-[#38bdf8] bg-[#38bdf8]/10 w-11 sm:w-12 h-11 sm:h-12 flex items-center justify-center rounded-xl mb-5 sm:mb-6"><Satellite /></div>
            <span className="text-4xl sm:text-5xl font-[800] block mb-2 tracking-tight">1.2M+</span>
            <span className="text-[#94a3b8] text-sm uppercase tracking-wider font-semibold">Hectares Scanned</span>
          </div>
          <div className="bg-[#0f172a]/60 backdrop-blur-md border border-white/10 p-6 sm:p-8 rounded-3xl transition-[transform,border-color] duration-300 hover:border-[#38bdf8] hover:-translate-y-2 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="text-[#38bdf8] bg-[#38bdf8]/10 w-11 sm:w-12 h-11 sm:h-12 flex items-center justify-center rounded-xl mb-5 sm:mb-6"><Activity /></div>
            <span className="text-4xl sm:text-5xl font-[800] block mb-2 tracking-tight">Real-time</span>
            <span className="text-[#94a3b8] text-sm uppercase tracking-wider font-semibold">Sensor Latency</span>
          </div>
          <div className="bg-[#0f172a]/60 backdrop-blur-md border border-white/10 p-6 sm:p-8 rounded-3xl transition-[transform,border-color] duration-300 hover:border-[#38bdf8] hover:-translate-y-2 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="text-[#38bdf8] bg-[#38bdf8]/10 w-11 sm:w-12 h-11 sm:h-12 flex items-center justify-center rounded-xl mb-5 sm:mb-6"><Zap /></div>
            <span className="text-4xl sm:text-5xl font-[800] block mb-2 tracking-tight">98.4%</span>
            <span className="text-[#94a3b8] text-sm uppercase tracking-wider font-semibold">Predictive Precision</span>
          </div>
        </section>
      </main>

      <footer className="mt-8 sm:mt-16 pt-12 sm:pt-16 pb-8 px-4 sm:px-6 border-t border-white/10 bg-[#020617]/40">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 md:gap-16 mb-10 sm:mb-16">
          <div className="sm:col-span-2">
            <div className="flex items-center gap-3 font-extrabold text-xl text-[#f8fafc] tracking-tight mb-4 sm:mb-6">
              <img src="/logo.svg" alt="Logo" className="w-8 h-8 rounded-full object-cover" />
              <span>SentraScope</span>
            </div>
            <p className="text-[#94a3b8] max-w-[400px] text-[0.95rem] leading-relaxed">
              Building the sovereign environmental monitoring infrastructure for a climate-resilient India.
            </p>
          </div>
          <div>
            <h4 className="text-white mb-4 sm:mb-6 font-semibold text-sm">Intelligence</h4>
            <div className="flex flex-col gap-3">
              <Link href="/about" className="text-[#94a3b8] hover:text-[#38bdf8] text-sm transition-colors">About Platform</Link>
              <Link href="/urbanization" className="text-[#94a3b8] hover:text-[#ef4444] text-sm transition-colors">Urbanization Intel</Link>
              <Link href="/dashboard" className="text-[#94a3b8] hover:text-[#38bdf8] text-sm transition-colors">Dashboard</Link>
            </div>
          </div>
          <div>
            <h4 className="text-white mb-4 sm:mb-6 font-semibold text-sm">Account</h4>
            <div className="flex flex-col gap-3">
              <Link href="/login" className="text-[#94a3b8] hover:text-[#38bdf8] text-sm transition-colors">Sign In</Link>
              <Link href="/signup" className="text-[#94a3b8] hover:text-[#38bdf8] text-sm transition-colors">Get Started</Link>
              <Link href="/privacy" className="text-[#94a3b8] hover:text-[#38bdf8] text-sm transition-colors">Data Ethics</Link>
            </div>
          </div>
        </div>
        <div className="max-w-[1200px] mx-auto pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-2 text-xs text-[#94a3b8]">
          <p>&copy; 2026 SentraScope. Engineered in India.</p>
          <p>India</p>
        </div>
      </footer>

    </>
  );
}
