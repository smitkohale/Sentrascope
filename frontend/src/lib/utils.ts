import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAqiColor(aqi: number): { bg: string; text: string; label: string; border: string } {
  if (aqi <= 50) return { bg: "bg-emerald-500/20", text: "text-emerald-400", border: "border-emerald-500/30", label: "Good" };
  if (aqi <= 100) return { bg: "bg-yellow-500/20", text: "text-yellow-400", border: "border-yellow-500/30", label: "Moderate" };
  if (aqi <= 150) return { bg: "bg-orange-500/20", text: "text-orange-400", border: "border-orange-500/30", label: "Unhealthy for Sensitive Groups" };
  if (aqi <= 200) return { bg: "bg-red-500/20", text: "text-red-400", border: "border-red-500/30", label: "Unhealthy" };
  if (aqi <= 300) return { bg: "bg-purple-500/20", text: "text-purple-400", border: "border-purple-500/30", label: "Very Unhealthy" };
  return { bg: "bg-rose-900/40", text: "text-rose-400", border: "border-rose-900/50", label: "Hazardous" };
}

export function getUvColor(uv: number): { bg: string; text: string; label: string; border: string } {
  if (uv <= 2) return { bg: "bg-emerald-500/20", text: "text-emerald-400", border: "border-emerald-500/30", label: "Low" };
  if (uv <= 5) return { bg: "bg-yellow-500/20", text: "text-yellow-400", border: "border-yellow-500/30", label: "Moderate" };
  if (uv <= 7) return { bg: "bg-orange-500/20", text: "text-orange-400", border: "border-orange-500/30", label: "High" };
  if (uv <= 10) return { bg: "bg-red-500/20", text: "text-red-400", border: "border-red-500/30", label: "Very High" };
  return { bg: "bg-violet-500/20", text: "text-violet-400", border: "border-violet-500/30", label: "Extreme" };
}
