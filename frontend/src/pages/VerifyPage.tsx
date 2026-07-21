import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Factory, CheckCircle, XCircle } from "lucide-react";
import { AuthManager } from "@/lib/auth";

const Logo = "/logo.svg";

type VerifyStatus = "waiting" | "verifying" | "success" | "error";

export function VerifyPage() {
  const [, setLocation] = useLocation();
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const email = params.get("email") || "";

  const [status, setStatus] = useState<VerifyStatus>(token ? "verifying" : "waiting");
  const [message, setMessage] = useState("");
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState("");

  useEffect(() => {
    if (!token) return;
    const verify = async () => {
      try {
        const res = await fetch(`/api/verify?token=${encodeURIComponent(token)}`);
        const data = await res.json();
        if (res.ok && data.verified) {
          AuthManager.initSession(data.user?.name, data.user?.email, data.token);
          setStatus("success");
          setTimeout(() => setLocation("/dashboard"), 2200);
        } else {
          setStatus("error");
          setMessage(data.message || "Verification failed.");
        }
      } catch {
        setStatus("error");
        setMessage("Network error. Please try again.");
      }
    };
    verify();
  }, [token]);

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    setResendMsg("");
    try {
      const res = await fetch("/api/resend-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setResendMsg(data.message || "New link dispatched.");
    } catch {
      setResendMsg("Failed to resend. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden px-6 pb-[4vh]">
      <div className="bg-glow" />

      <div className="flex flex-col items-center w-full max-w-[440px]">
        <Link href="/" className="flex flex-col items-center gap-3 mb-8 no-underline group">
          <img
            src={Logo}
            alt="SentraScope"
            className="w-14 h-14 rounded-2xl object-cover"
            style={{ filter: "drop-shadow(0 0 15px rgba(56,189,248,0.4))", transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}
          />
          <span className="text-[1.4rem] font-[850] tracking-[-0.5px] text-[#f8fafc]" style={{ fontFamily: "Inter, sans-serif" }}>
            SentraScope
          </span>
        </Link>

        <main
          className="relative w-full text-center rounded-[32px] px-10 pt-12 pb-10"
          style={{
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
            animation: "fadeInScale 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both",
          }}
        >
          <Link
            href="/"
            className="absolute top-5 left-5 flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-xl transition-[color,background-color,border-color] duration-150"
            style={{ color: "#94a3b8", background: "rgba(255,255,255,0.03)", border: "1px solid transparent", textDecoration: "none" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#38bdf8"; (e.currentTarget as HTMLElement).style.background = "rgba(56,189,248,0.1)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(56,189,248,0.2)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#94a3b8"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; (e.currentTarget as HTMLElement).style.borderColor = "transparent"; }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </Link>

          <style>{`
            @keyframes signalRing {
              0% { transform: translate(-50%, -50%) scale(0.3); opacity: 0.7; }
              100% { transform: translate(-50%, -50%) scale(1.8); opacity: 0; }
            }
            @keyframes dataStream {
              0% { height: 0; opacity: 0.8; top: 18px; }
              100% { height: 80px; opacity: 0; top: 18px; }
            }
            @keyframes satelliteFloat {
              0%, 100% { transform: translateX(-50%) translateY(0); }
              50% { transform: translateX(-50%) translateY(-6px); }
            }
            @keyframes pulseDot {
              0%, 100% { opacity: 1; transform: scale(1); }
              50% { opacity: 0.4; transform: scale(0.7); }
            }
            @keyframes fadeInScale {
              from { opacity: 0; transform: scale(0.96) translateY(10px); }
              to { opacity: 1; transform: scale(1) translateY(0); }
            }
          `}</style>

          {/* Visual */}
          {status === "success" ? (
            <div className="flex justify-center mb-6">
              <CheckCircle className="w-16 h-16 text-[#10b981]" style={{ filter: "drop-shadow(0 0 20px rgba(16,185,129,0.5))" }} />
            </div>
          ) : status === "error" ? (
            <div className="flex justify-center mb-6">
              <XCircle className="w-16 h-16 text-[#ef4444]" style={{ filter: "drop-shadow(0 0 20px rgba(239,68,68,0.5))" }} />
            </div>
          ) : (
            <div className="relative h-36 w-full mb-6 flex justify-center items-center">
              <div className="absolute" style={{ top: "22px", left: "50%", width: "60px", height: "60px", borderRadius: "50%", border: "1.5px solid #38bdf8", transform: "translate(-50%, -50%)", animation: "signalRing 3s ease-out infinite", animationDelay: "0s" }} />
              <div className="absolute" style={{ top: "22px", left: "50%", width: "60px", height: "60px", borderRadius: "50%", border: "1.5px solid #38bdf8", transform: "translate(-50%, -50%)", animation: "signalRing 3s ease-out infinite", animationDelay: "1.5s" }} />
              <div className="absolute" style={{ top: 0, left: "50%", transform: "translateX(-50%)", animation: "satelliteFloat 3s ease-in-out infinite" }}>
                <img src={Logo} alt="" className="w-8 h-8 rounded-full object-cover" style={{ filter: "drop-shadow(0 0 8px rgba(56,189,248,0.6))" }} />
              </div>
              <div className="absolute" style={{ top: "18px", left: "50%", width: "2px", marginLeft: "-1px", background: "linear-gradient(to bottom, #38bdf8, transparent)", animation: "dataStream 1.5s ease-in infinite" }} />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2" style={{ color: "#94a3b8" }}>
                <Factory className="w-10 h-10" />
              </div>
            </div>
          )}

          {/* Text content by state */}
          {status === "waiting" && (
            <>
              <h2 className="text-[1.6rem] font-[800] tracking-tight text-white mb-3">Verify your identity</h2>
              <p className="text-[#94a3b8] text-[0.9rem] leading-relaxed mb-6">
                A secure access link has been dispatched to{" "}
                {email ? <strong className="text-white">{email}</strong> : "your email"}.
                <br />Click the link to authorize this station.
              </p>
              <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full text-sm font-semibold mb-6" style={{ background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.2)", color: "#38bdf8", fontFamily: "JetBrains Mono, monospace" }}>
                <span className="w-2 h-2 rounded-full" style={{ background: "#38bdf8", animation: "pulseDot 1.4s ease-in-out infinite", display: "inline-block" }} />
                Awaiting Uplink...
              </div>
              <p className="text-[#94a3b8] text-[0.85rem]">
                Haven&apos;t received the link?{" "}
                <button
                  onClick={handleResend}
                  disabled={resending}
                  className="font-semibold transition-colors disabled:opacity-50"
                  style={{ color: "#38bdf8", background: "none", border: "none", cursor: "pointer" }}
                >
                  {resending ? "Dispatching..." : "Re-dispatch Link"}
                </button>
              </p>
              {resendMsg && <p className="text-[#10b981] text-xs mt-3 font-medium">{resendMsg}</p>}
            </>
          )}

          {status === "verifying" && (
            <>
              <h2 className="text-[1.6rem] font-[800] tracking-tight text-white mb-3">Verifying uplink...</h2>
              <p className="text-[#94a3b8] text-[0.9rem] leading-relaxed mb-6">Authenticating your secure access token.</p>
              <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full text-sm font-semibold mb-6" style={{ background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.2)", color: "#38bdf8", fontFamily: "JetBrains Mono, monospace" }}>
                <div className="w-3 h-3 border-2 border-[#38bdf8]/30 border-t-[#38bdf8] rounded-full animate-spin" />
                Processing...
              </div>
            </>
          )}

          {status === "success" && (
            <>
              <h2 className="text-[1.6rem] font-[800] tracking-tight text-white mb-3">Identity Confirmed</h2>
              <p className="text-[#94a3b8] text-[0.9rem] leading-relaxed mb-6">Uplink authorized. Redirecting to your station...</p>
              <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full text-sm font-semibold" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#10b981", fontFamily: "JetBrains Mono, monospace" }}>
                <span className="w-2 h-2 rounded-full" style={{ background: "#10b981", animation: "pulseDot 1.4s ease-in-out infinite", display: "inline-block" }} />
                Access Granted
              </div>
            </>
          )}

          {status === "error" && (
            <>
              <h2 className="text-[1.6rem] font-[800] tracking-tight text-white mb-3">Verification Failed</h2>
              <p className="text-[#94a3b8] text-[0.9rem] leading-relaxed mb-6">{message}</p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Link href="/signup" className="px-5 py-2.5 rounded-xl text-sm font-bold" style={{ background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.2)", color: "#38bdf8", textDecoration: "none" }}>
                  Re-register
                </Link>
                <Link href="/login" className="px-5 py-2.5 rounded-xl text-sm font-bold" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", textDecoration: "none" }}>
                  Back to Login
                </Link>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
