import { Link } from "wouter";
import { Satellite, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center relative px-6" style={{ background: "#020617" }}>
      <div className="bg-glow" />

      {/* Ambient rings */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{ border: "1px solid rgba(56,189,248,0.06)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
          style={{ border: "1px solid rgba(56,189,248,0.09)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full"
          style={{ border: "1px solid rgba(56,189,248,0.14)" }} />
      </div>

      <div className="relative z-10 text-center animate-in fade-in zoom-in-95 duration-500 max-w-md">
        {/* Icon */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{ background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.2)", boxShadow: "0 0 40px rgba(56,189,248,0.15)" }}>
            <Satellite className="w-10 h-10" style={{ color: "#38bdf8", filter: "drop-shadow(0 0 6px rgba(56,189,248,0.5))" }} />
          </div>
        </div>

        {/* Code */}
        <p className="text-xs font-mono font-bold uppercase tracking-[0.3em] mb-3" style={{ color: "#38bdf8" }}>
          Signal Lost · 404
        </p>

        {/* Heading */}
        <h1 className="text-5xl font-black mb-4 text-white" style={{ letterSpacing: "-2px" }}>
          Off the Grid
        </h1>

        {/* Sub */}
        <p className="text-[#94a3b8] text-base leading-relaxed mb-10">
          This sector doesn't exist on the map.<br />
          The page you're looking for has gone dark.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-transform duration-200 hover:-translate-y-0.5"
            style={{ background: "#38bdf8", color: "#020617", boxShadow: "0 8px 24px -6px rgba(56,189,248,0.4)" }}>
            <Home className="w-4 h-4" />
            Return to Base
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-[transform,color] duration-200 hover:-translate-y-0.5 text-[#94a3b8] hover:text-white"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
