import type { CSSProperties } from "react";

function Sk({ className, style }: { className: string; style?: CSSProperties }) {
  return <div className={`sk ${className}`} style={style} />;
}

function NavSkeleton({ accent = "#38bdf8" }: { accent?: string }) {
  return (
    <nav
      className="flex justify-between items-center px-4 sm:px-6 py-4 sm:py-5 sticky top-0 z-50 border-b border-white/10"
      style={{ background: "rgba(2,6,23,0.7)", backdropFilter: "blur(12px)" }}
    >
      <div className="flex items-center gap-3">
        <Sk className="w-8 h-8 rounded-full" />
        <Sk className="w-28 h-5 rounded-lg" />
      </div>
      <div className="hidden md:flex items-center gap-6">
        <Sk className="w-10 h-4 rounded" />
        <Sk className="w-16 h-4 rounded" />
        <Sk className="w-10 h-4 rounded" />
        <Sk className="w-10 h-4 rounded" />
        <Sk className="w-24 h-9 rounded-xl" style={{ backgroundColor: `${accent}22` }} />
      </div>
      <Sk className="md:hidden w-8 h-8 rounded-lg" />
    </nav>
  );
}

export function LandingPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#020617]">
      <NavSkeleton />
      <div className="max-w-[1100px] mx-auto px-6 pt-24 pb-16 flex flex-col items-center text-center gap-6">
        <Sk className="w-44 h-6 rounded-full" />
        <div className="flex flex-col items-center gap-3 w-full">
          <Sk className="w-[70%] h-14 rounded-2xl" />
          <Sk className="w-[55%] h-14 rounded-2xl" />
        </div>
        <div className="flex flex-col items-center gap-2 w-full">
          <Sk className="w-[50%] h-5 rounded" />
          <Sk className="w-[44%] h-5 rounded" />
          <Sk className="w-[38%] h-5 rounded" />
        </div>
        <div className="flex gap-3 mt-2 flex-wrap justify-center">
          <Sk className="w-44 h-12 rounded-xl" />
          <Sk className="w-40 h-12 rounded-xl" />
          <Sk className="w-36 h-12 rounded-xl" />
        </div>
      </div>
      <div className="border-y border-white/10 py-4 flex gap-12 px-8 overflow-hidden">
        {[...Array(5)].map((_, i) => <Sk key={i} className="w-48 h-4 rounded shrink-0" />)}
      </div>
      <div className="max-w-[1100px] mx-auto px-6 pt-16 pb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/8 p-6 flex flex-col gap-3"
            style={{ background: "rgba(15,23,42,0.6)" }}
          >
            <Sk className="w-10 h-10 rounded-xl" />
            <Sk className="w-32 h-5 rounded" />
            <Sk className="w-full h-4 rounded" />
            <Sk className="w-4/5 h-4 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AuthPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-6">
      <div className="w-full max-w-[440px] flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-3">
          <Sk className="w-14 h-14 rounded-full" />
          <Sk className="w-32 h-6 rounded-lg" />
        </div>
        <div
          className="w-full rounded-[28px] border border-white/10 p-9 flex flex-col gap-5"
          style={{ background: "rgba(15,23,42,0.7)" }}
        >
          <div className="flex flex-col items-center gap-2">
            <Sk className="w-40 h-7 rounded-lg" />
            <Sk className="w-56 h-4 rounded" />
          </div>
          <div className="flex flex-col gap-4 mt-2">
            <div className="flex flex-col gap-1.5">
              <Sk className="w-20 h-4 rounded" />
              <Sk className="w-full h-11 rounded-xl" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Sk className="w-16 h-4 rounded" />
              <Sk className="w-full h-11 rounded-xl" />
            </div>
          </div>
          <Sk className="w-full h-12 rounded-xl mt-1" />
          <Sk className="w-3/4 h-4 rounded mx-auto" />
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="h-screen bg-[#020617] flex flex-col overflow-hidden">
      <div
        className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0"
        style={{ background: "rgba(2,6,23,0.9)" }}
      >
        <div className="flex items-center gap-3">
          <Sk className="w-8 h-8 rounded-full" />
          <Sk className="w-28 h-5 rounded-lg" />
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <Sk className="w-24 h-4 rounded" />
          <Sk className="w-24 h-4 rounded" />
        </div>
        <Sk className="w-9 h-9 rounded-full" />
      </div>
      <div className="flex flex-1 overflow-hidden relative">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #0a1628 0%, #020617 60%, #0d1f3c 100%)",
          }}
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 40%, #38bdf8 0%, transparent 50%), radial-gradient(circle at 70% 60%, #0ea5e9 0%, transparent 40%)",
            }}
          />
        </div>
        <div className="absolute left-3 top-3 flex flex-col gap-2 z-10">
          {(["#38bdf8", "#f97316", "#a855f7", "#22c55e", "#ef4444"] as const).map(
            (color, i) => (
              <Sk
                key={i}
                className="w-10 h-10 rounded-xl"
                style={{ borderColor: `${color}33`, border: "1px solid" }}
              />
            )
          )}
        </div>
        <div className="absolute right-3 top-3 flex flex-col gap-3 z-10 w-[280px]">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/10 p-4 flex flex-col gap-3"
              style={{ background: "rgba(15,23,42,0.85)", backdropFilter: "blur(12px)" }}
            >
              <div className="flex items-center gap-2">
                <Sk className="w-5 h-5 rounded" />
                <Sk className="w-28 h-4 rounded" />
              </div>
              <Sk className="w-16 h-8 rounded-lg" />
              <div className="flex gap-2">
                <Sk className="flex-1 h-3 rounded" />
                <Sk className="flex-1 h-3 rounded" />
              </div>
              <Sk className="w-full h-16 rounded-xl" />
            </div>
          ))}
        </div>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {[...Array(4)].map((_, i) => (
            <Sk key={i} className="w-24 h-8 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function AlertsSkeleton() {
  return (
    <div className="min-h-screen bg-[#020617]">
      <NavSkeleton />
      <div className="max-w-3xl mx-auto px-6 pt-12 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Sk className="w-48 h-7 rounded-lg" />
          <Sk className="w-72 h-4 rounded" />
        </div>
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/10 p-6 flex flex-col gap-4"
            style={{ background: "rgba(15,23,42,0.6)" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sk className="w-10 h-10 rounded-xl" />
                <div className="flex flex-col gap-2">
                  <Sk className="w-32 h-5 rounded" />
                  <Sk className="w-48 h-4 rounded" />
                </div>
              </div>
              <Sk className="w-12 h-6 rounded-full" />
            </div>
            <Sk className="w-full h-10 rounded-xl" />
          </div>
        ))}
        <Sk className="w-full h-12 rounded-xl" />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-[#020617]">
      <NavSkeleton />
      <div className="max-w-2xl mx-auto px-6 pt-12 flex flex-col gap-6">
        <div
          className="rounded-2xl border border-white/10 p-8 flex flex-col items-center gap-4"
          style={{ background: "rgba(15,23,42,0.6)" }}
        >
          <Sk className="w-20 h-20 rounded-full" />
          <Sk className="w-36 h-6 rounded-lg" />
          <Sk className="w-24 h-4 rounded" />
          <Sk className="w-36 h-10 rounded-xl" />
        </div>
        <div
          className="rounded-2xl border border-white/10 p-6 flex flex-col gap-4"
          style={{ background: "rgba(15,23,42,0.6)" }}
        >
          <Sk className="w-36 h-5 rounded-lg" />
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex justify-between items-center border-b border-white/6 pb-3"
            >
              <Sk className="w-28 h-4 rounded" />
              <Sk className="w-36 h-4 rounded" />
            </div>
          ))}
        </div>
        <Sk className="w-full h-12 rounded-xl" />
      </div>
    </div>
  );
}

export function UrbanizationLandingSkeleton() {
  return (
    <div className="min-h-screen" style={{ background: "#050000" }}>
      <NavSkeleton accent="#ef4444" />
      <div className="max-w-[1100px] mx-auto px-6 pt-24 pb-16 flex flex-col items-center text-center gap-6">
        <Sk
          className="w-52 h-6 rounded-full"
          style={{ backgroundColor: "rgba(239,68,68,0.15)" }}
        />
        <div className="flex flex-col items-center gap-3 w-full">
          <Sk className="w-[65%] h-14 rounded-2xl" />
          <Sk className="w-[50%] h-14 rounded-2xl" />
        </div>
        <div className="flex flex-col items-center gap-2 w-full">
          <Sk className="w-[50%] h-5 rounded" />
          <Sk className="w-[42%] h-5 rounded" />
        </div>
        <div className="flex gap-3 mt-2 flex-wrap justify-center">
          <Sk
            className="w-44 h-12 rounded-xl"
            style={{ backgroundColor: "rgba(239,68,68,0.15)" }}
          />
          <Sk className="w-40 h-12 rounded-xl" />
        </div>
      </div>
      <div className="max-w-[1100px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/8 p-5 flex flex-col gap-2"
            style={{ background: "rgba(30,0,0,0.5)" }}
          >
            <Sk
              className="w-10 h-10 rounded-xl"
              style={{ backgroundColor: "rgba(239,68,68,0.12)" }}
            />
            <Sk className="w-20 h-8 rounded-lg" />
            <Sk className="w-24 h-3 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function UrbanizationDashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#020617]">
      <NavSkeleton accent="#ef4444" />
      <div className="max-w-[1400px] mx-auto px-4 pt-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Sk className="w-48 h-6 rounded-lg" />
          <div className="flex gap-2">
            <Sk className="w-28 h-9 rounded-xl" />
            <Sk className="w-28 h-9 rounded-xl" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div
            className="rounded-2xl border border-white/10 overflow-hidden"
            style={{ background: "rgba(15,23,42,0.6)", height: 380 }}
          >
            <div className="p-4 border-b border-white/8">
              <Sk className="w-36 h-5 rounded" />
            </div>
            <div
              className="p-4"
              style={{ background: "linear-gradient(135deg, #0a1628 0%, #050a14 100%)", height: "calc(100% - 53px)" }}
            >
              <Sk className="w-full h-full rounded-xl" style={{ opacity: 0.4 }} />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div
              className="rounded-2xl border border-white/10 p-5 flex flex-col gap-4"
              style={{ background: "rgba(15,23,42,0.6)", flex: 1 }}
            >
              <Sk className="w-40 h-5 rounded" />
              <Sk className="w-full h-36 rounded-xl" />
            </div>
            <div
              className="rounded-2xl border border-white/10 p-5 flex flex-col gap-4"
              style={{ background: "rgba(15,23,42,0.6)" }}
            >
              <Sk className="w-32 h-5 rounded" />
              <Sk className="w-full h-24 rounded-xl" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/10 p-5 flex flex-col gap-3"
              style={{ background: "rgba(15,23,42,0.6)" }}
            >
              <Sk className="w-8 h-8 rounded-lg" />
              <Sk className="w-20 h-7 rounded" />
              <Sk className="w-28 h-3 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ContentPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#020617]">
      <NavSkeleton />
      <div className="max-w-4xl mx-auto px-6 pt-16 pb-12 flex flex-col gap-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <Sk className="w-36 h-7 rounded-lg" />
          <Sk className="w-72 h-5 rounded" />
          <Sk className="w-56 h-5 rounded" />
        </div>
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/10 p-7 flex flex-col gap-4"
            style={{ background: "rgba(15,23,42,0.6)" }}
          >
            <div className="flex items-center gap-3">
              <Sk className="w-10 h-10 rounded-xl" />
              <Sk className="w-40 h-5 rounded" />
            </div>
            <Sk className="w-full h-4 rounded" />
            <Sk className="w-5/6 h-4 rounded" />
            <Sk className="w-4/6 h-4 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SimplePageSkeleton() {
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Sk className="w-16 h-16 rounded-full" />
        <Sk className="w-48 h-6 rounded-lg" />
        <Sk className="w-64 h-4 rounded" />
        <Sk className="w-36 h-10 rounded-xl mt-2" />
      </div>
    </div>
  );
}
