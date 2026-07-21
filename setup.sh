#!/usr/bin/env bash
set -euo pipefail

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

info()  { echo -e "${GREEN}[sentrascope]${NC} $*"; }
warn()  { echo -e "${YELLOW}[sentrascope]${NC} $*"; }
error() { echo -e "${RED}[sentrascope]${NC} $*"; exit 1; }

# ── Prerequisites ──────────────────────────────────────────────────────────────
info "Checking prerequisites..."

command -v node  >/dev/null 2>&1 || error "Node.js 20+ is required. Install from https://nodejs.org"
command -v pnpm  >/dev/null 2>&1 || error "pnpm is required. Run: npm install -g pnpm"

NODE_MAJOR=$(node -e "console.log(process.versions.node.split('.')[0])")
if [ "$NODE_MAJOR" -lt 20 ]; then
  error "Node.js 20+ required (found v$(node -v | tr -d 'v')). Install from https://nodejs.org"
fi

info "Node.js $(node -v) ✓  pnpm $(pnpm -v) ✓"

# ── .env setup ─────────────────────────────────────────────────────────────────
if [ ! -f .env ]; then
  info "Creating .env from .env.example..."
  cp .env.example .env
  warn "IMPORTANT: Open .env and fill in your Supabase DATABASE_URL before starting the app."
  warn "  Get it from: Supabase dashboard → Project Settings → Database → Connection string → URI"
  warn "  Required: DATABASE_URL, SESSION_SECRET"
  warn "  Optional: WAQI_API_TOKEN, NASA_FIRMS_MAP_KEY, OPENUV_API_KEY, BREVO_API_KEY"
else
  info ".env already exists — skipping copy."
fi

# ── Install dependencies ───────────────────────────────────────────────────────
info "Installing dependencies..."
pnpm install

# ── Build libs & run codegen ──────────────────────────────────────────────────
info "Building shared libraries..."
pnpm run typecheck:libs

info "Running API codegen..."
pnpm --filter @workspace/api-spec run codegen

# ── Supabase schema ───────────────────────────────────────────────────────────
info "Next step: open Supabase dashboard → SQL Editor → New query, paste the contents of database/supabase-init.sql, and click Run."
info "  This creates the users and alert_settings tables (idempotent — safe to re-run)."

echo ""
info "✅ Setup complete! Start the app with:"
echo ""
echo "  # Terminal 1 — API server:"
echo "  pnpm --filter @workspace/api-server run dev"
echo ""
echo "  # Terminal 2 — Frontend:"
echo "  pnpm --filter @workspace/sentrascope run dev"
echo ""
echo "  Then open http://localhost:5173 in your browser."
echo ""
warn "Make sure .env has DATABASE_URL and SESSION_SECRET filled in."
