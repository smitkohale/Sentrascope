import { useState } from "react";
import { Link } from "wouter";
import { Info, Wind, ThermometerSun, Building2, Layers, Cpu, Database, Wifi, Shield, ArrowUpRight, Menu, X } from "lucide-react";

export function AboutPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <>
      <div className="bg-glow" />
      
      <nav className="flex justify-between items-center px-4 sm:px-6 py-4 sm:py-5 bg-[#020617]/70 backdrop-blur-md sticky top-0 z-50 border-b border-white/10">
        <Link href="/" className="flex items-center gap-3 font-extrabold text-[1.2rem] sm:text-[1.4rem] text-[#f8fafc] tracking-tight">
          <img src="/logo.svg" alt="Logo" className="w-7 sm:w-8 h-7 sm:h-8 rounded-full object-cover drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]" />
          <span>SentraScope</span>
        </Link>
        <div className="hidden md:flex gap-10 items-center">
          <Link href="/" className="text-[#94a3b8] hover:text-[#f8fafc] text-sm font-medium transition-colors pb-1 border-b-2 border-transparent hover:border-[#38bdf8]">Home</Link>
          <Link href="/about" className="text-[#f8fafc] text-sm font-medium drop-shadow-[0_0_8px_rgba(56,189,248,0.5)] border-b-2 border-[#38bdf8] pb-1">Capabilities</Link>
          <Link href="/privacy" className="text-[#94a3b8] hover:text-[#f8fafc] text-sm font-medium transition-colors pb-1 border-b-2 border-transparent hover:border-[#38bdf8]">Ethics</Link>
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
        <div className="md:hidden fixed inset-0 top-[61px] z-40 bg-[#020617]/95 backdrop-blur-md flex flex-col px-6 pt-8 gap-6 animate-in fade-in slide-in-from-top-2 duration-200">
          <Link href="/" onClick={() => setMobileNavOpen(false)} className="text-[#94a3b8] hover:text-[#f8fafc] text-lg font-semibold border-b border-white/10 pb-4 transition-colors">Home</Link>
          <Link href="/about" onClick={() => setMobileNavOpen(false)} className="text-[#f8fafc] text-lg font-semibold border-b border-white/10 pb-4">Capabilities</Link>
          <Link href="/privacy" onClick={() => setMobileNavOpen(false)} className="text-[#94a3b8] hover:text-[#f8fafc] text-lg font-semibold border-b border-white/10 pb-4 transition-colors">Ethics</Link>
          <Link href="/login" onClick={() => setMobileNavOpen(false)} className="text-[#94a3b8] hover:text-[#f8fafc] text-lg font-semibold border-b border-white/10 pb-4 transition-colors">Sign In</Link>
          <Link href="/signup" onClick={() => setMobileNavOpen(false)} className="bg-[#38bdf8] text-black px-6 py-3 rounded-xl font-bold text-base text-center shadow-[0_10px_30px_-10px_rgba(56,189,248,0.5)] transition-transform duration-200 mt-2">Get Started</Link>
        </div>
      )}

      <div className="max-w-[1000px] mx-auto pt-24 pb-16 px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-[#38bdf8]/10 text-[#38bdf8] px-4 py-1.5 rounded-full text-xs font-semibold mb-8 border border-[#38bdf8]/20 animate-[float_4s_ease-in-out_infinite] [will-change:transform]">
          <Info className="w-3.5 h-3.5" />
          About the Intelligence Network
        </div>
        <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-[850] mb-6 tracking-[-2px] bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-[#38bdf8]">
          Protecting India’s Ecology
        </h1>
        <p className="text-[#94a3b8] text-[1.2rem] max-w-[800px] mx-auto mb-16 leading-relaxed">
          SentraScope is a specialized environmental intelligence platform designed to monitor the unique ecological challenges of the Indian subcontinent.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <div className="bg-[#0f172a]/60 backdrop-blur-md p-10 rounded-3xl border border-white/10 transition-[transform,border-color] duration-300 hover:border-[#38bdf8] hover:-translate-y-1 relative overflow-hidden flex flex-col group">
            <div className="text-[#38bdf8] bg-[#38bdf8]/10 w-12 h-12 flex items-center justify-center rounded-xl mb-6 border border-[#38bdf8]/20"><Wind /></div>
            <h3 className="text-[1.4rem] text-white font-bold mb-4 tracking-tight">Air Quality (AQI)</h3>
            <p className="text-[#94a3b8] text-[0.95rem] flex-grow leading-relaxed">Tracking PM2.5 and PM10 levels across major industrial hubs and metropolitan areas in real-time.</p>
          </div>

          <div className="bg-[#0f172a]/60 backdrop-blur-md p-10 rounded-3xl border border-white/10 transition-[transform,border-color] duration-300 hover:border-[#38bdf8] hover:-translate-y-1 relative overflow-hidden flex flex-col group">
            <div className="text-[#38bdf8] bg-[#38bdf8]/10 w-12 h-12 flex items-center justify-center rounded-xl mb-6 border border-[#38bdf8]/20"><ThermometerSun /></div>
            <h3 className="text-[1.4rem] text-white font-bold mb-4 tracking-tight">Heat Monitoring</h3>
            <p className="text-[#94a3b8] text-[0.95rem] flex-grow leading-relaxed">Early warning systems for heatwaves across various climatic zones to prevent health crises.</p>
          </div>

          <div className="bg-[#0f172a]/60 backdrop-blur-md p-10 rounded-3xl border border-white/10 transition-[transform,border-color] duration-300 hover:border-[#ef4444] hover:-translate-y-1 relative overflow-hidden flex flex-col group">
            <Link href="/urbanization" className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-[#94a3b8] border border-white/10 hover:bg-[#ef4444]/20 hover:text-[#ef4444] hover:border-[#ef4444] transition-[border-color,color,background-color] duration-200" title="View Urbanization">
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <div className="text-[#ef4444] bg-[#ef4444]/10 w-12 h-12 flex items-center justify-center rounded-xl mb-6 border border-[#ef4444]/20"><Building2 /></div>
            <h3 className="text-[1.4rem] text-white font-bold mb-4 tracking-tight">Urbanization Intelligence</h3>
            <p className="text-[#94a3b8] text-[0.95rem] flex-grow leading-relaxed">Detecting unauthorized construction and land-use changes in protected zones using satellite comparisons.</p>
          </div>

          <div className="bg-[#0f172a]/60 backdrop-blur-md p-10 rounded-3xl border border-white/10 transition-[transform,border-color] duration-300 hover:border-[#38bdf8] hover:-translate-y-1 relative overflow-hidden flex flex-col group">
            <div className="text-[#38bdf8] bg-[#38bdf8]/10 w-12 h-12 flex items-center justify-center rounded-xl mb-6 border border-[#38bdf8]/20"><Layers /></div>
            <h3 className="text-[1.4rem] text-white font-bold mb-4 tracking-tight">And More...</h3>
            <p className="text-[#94a3b8] text-[0.95rem] flex-grow leading-relaxed">Expanding into water table analysis, coastal erosion tracking, and localized agricultural health monitoring.</p>
          </div>
        </div>
      </div>

      <div className="bg-[#0f172a]/40 border-y border-white/10 py-4 mt-16 overflow-hidden whitespace-nowrap flex">
        <div className="inline-flex gap-16 animate-[scroll_40s_linear_infinite] shrink-0 min-w-max pr-16 [will-change:transform]">
          <div className="flex items-center gap-2 font-mono text-sm text-[#94a3b8] uppercase tracking-wider"><Cpu className="w-3.5 h-3.5" /> Multi-Spectrum Analysis: <span className="text-[#38bdf8] font-bold">Active</span></div>
          <div className="flex items-center gap-2 font-mono text-sm text-[#94a3b8] uppercase tracking-wider"><Database className="w-3.5 h-3.5" /> Data Nodes: <span className="text-[#38bdf8] font-bold">Nagpur / Delhi / Mumbai</span></div>
          <div className="flex items-center gap-2 font-mono text-sm text-[#94a3b8] uppercase tracking-wider"><Wifi className="w-3.5 h-3.5" /> IoT Mesh Status: <span className="text-[#38bdf8] font-bold">Optimized</span></div>
          <div className="flex items-center gap-2 font-mono text-sm text-[#94a3b8] uppercase tracking-wider"><Shield className="w-3.5 h-3.5" /> Encryption: <span className="text-[#38bdf8] font-bold">AES-256</span></div>
        </div>
        <div className="inline-flex gap-16 animate-[scroll_40s_linear_infinite] shrink-0 min-w-max pr-16 [will-change:transform]" aria-hidden>
          <div className="flex items-center gap-2 font-mono text-sm text-[#94a3b8] uppercase tracking-wider"><Cpu className="w-3.5 h-3.5" /> Multi-Spectrum Analysis: <span className="text-[#38bdf8] font-bold">Active</span></div>
          <div className="flex items-center gap-2 font-mono text-sm text-[#94a3b8] uppercase tracking-wider"><Database className="w-3.5 h-3.5" /> Data Nodes: <span className="text-[#38bdf8] font-bold">Nagpur / Delhi / Mumbai</span></div>
          <div className="flex items-center gap-2 font-mono text-sm text-[#94a3b8] uppercase tracking-wider"><Wifi className="w-3.5 h-3.5" /> IoT Mesh Status: <span className="text-[#38bdf8] font-bold">Optimized</span></div>
          <div className="flex items-center gap-2 font-mono text-sm text-[#94a3b8] uppercase tracking-wider"><Shield className="w-3.5 h-3.5" /> Encryption: <span className="text-[#38bdf8] font-bold">AES-256</span></div>
        </div>
      </div>

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
              <Link href="/privacy" className="text-[#94a3b8] hover:text-[#38bdf8] text-sm transition-colors">Data Ethics</Link>
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
