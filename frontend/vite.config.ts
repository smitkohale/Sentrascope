import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import fs from "fs";

function loadRootEnv() {
  const rootEnvPath = path.resolve(import.meta.dirname, "../.env");
  if (!fs.existsSync(rootEnvPath)) return;

  const content = fs.readFileSync(rootEnvPath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match || process.env[match[1]] !== undefined) continue;
    process.env[match[1]] = match[2];
  }
}

loadRootEnv();

const port = Number(process.env.VITE_PORT || process.env.FRONTEND_PORT || 5173);
const basePath = process.env.BASE_PATH || "/";
const apiPort = process.env.API_SERVER_PORT || process.env.PORT || 5000;

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-dom/client",
      "@tanstack/react-query",
      "wouter",
      "clsx",
      "tailwind-merge",
    ],
  },
  esbuild: {
    target: "esnext",
    legalComments: "none",
  },
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    target: "esnext",
    reportCompressedSize: false,
    chunkSizeWarningLimit: 800,
    cssMinify: true,
    assetsInlineLimit: 2048,
    modulePreload: { polyfill: false },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes("node_modules/leaflet") ||
            id.includes("node_modules/react-leaflet") ||
            id.includes("leaflet.heat")
          ) {
            return "vendor-leaflet";
          }
          if (id.includes("node_modules/framer-motion")) {
            return "vendor-framer";
          }
          if (
            id.includes("node_modules/recharts") ||
            id.includes("node_modules/d3-") ||
            id.includes("node_modules/victory-")
          ) {
            return "vendor-charts";
          }
          if (id.includes("node_modules/@radix-ui")) {
            return "vendor-radix";
          }
          if (id.includes("node_modules/lucide-react")) {
            return "vendor-icons";
          }
          if (id.includes("node_modules/@tanstack")) {
            return "vendor-query";
          }
          if (
            id.includes("node_modules/react-dom") ||
            id.includes("node_modules/react/")
          ) {
            return "vendor-react";
          }
          if (id.includes("node_modules/date-fns")) {
            return "vendor-datefns";
          }
          if (id.includes("node_modules/zod")) {
            return "vendor-zod";
          }
        },
      },
    },
  },
  server: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
    headers:
      process.env.NODE_ENV !== "production"
        ? {
            "Cache-Control": "no-store, no-cache, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          }
        : {},
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
    proxy: {
      "/api": {
        target: `http://localhost:${apiPort}`,
        changeOrigin: true,
        rewrite: (p) => p,
      },
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
