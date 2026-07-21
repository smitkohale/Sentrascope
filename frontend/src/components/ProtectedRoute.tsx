import { ReactNode, useEffect } from "react";
import { useLocation } from "wouter";
import { AuthManager } from "@/lib/auth";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!AuthManager.isAuthenticated()) {
      sessionStorage.setItem("sentra_redirect_after_login", location);
      setLocation("/login");
    }
  }, [setLocation, location]);

  if (!AuthManager.isAuthenticated()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050000]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#ef4444]/30 border-t-[#ef4444] rounded-full animate-spin" />
          <p className="text-[#94a3b8] text-sm font-medium">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
