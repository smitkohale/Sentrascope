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
command -v docker >/dev/null 2>&1 || warn "Docker not found — you'll need to start PostgreSQL manually."

NODE_MAJOR=$(node -e "console.log(process.versions.node.split('.')[0])")
if [ "$NODE_MAJOR" -lt 20 ]; then
  error "Node.js 20+ required (found v$(node -v | tr -d 'v')). Install from https://nodejs.org"
fi

info "Node.js $(node -v) ✓  pnpm $(pnpm -v) ✓"

# ── .env setup ─────────────────────────────────────────────────────────────────
if [ ! -f .env ]; then
  info "Creating .env from .env.example..."
  cp .env.example .env
  warn "IMPORTANT: Open .env and fill in your API keys before starting the app."
  warn "  Required: DATABASE_URL, SESSION_SECRET"
  warn "  Optional: WAQI_API_TOKEN, NASA_FIRMS_MAP_KEY, OPENUV_API_KEY, BREVO_API_KEY"
else
  info ".env already exists — skipping copy."
fi

# ── PostgreSQL via Docker ──────────────────────────────────────────────────────
if command -v docker >/dev/null 2>&1; then
  if ! docker info >/dev/null 2>&1; then
    warn "Docker daemon not running. Start Docker and re-run, or start PostgreSQL manually."
  else
    info "Starting PostgreSQL via Docker Compose..."
    docker compose up -d postgres
    info "Waiting for PostgreSQL to be ready..."
    until docker compose exec -T postgres pg_isready -U sentrascope >/dev/null 2>&1; do
      sleep 1
    done
    info "PostgreSQL is ready ✓"
    # Auto-set DATABASE_URL if it's still the placeholder
    if grep -q "user:password@localhost" .env 2>/dev/null; then
      sed -i.bak 's|postgresql://user:password@localhost:5432/sentrascope|postgresql://sentrascope:sentrascope@localhost:5432/sentrascope|g' .env
      rm -f .env.bak
      info "Updated DATABASE_URL in .env to use Docker Postgres ✓"
    fi
  fi
fi

# ── Install dependencies ───────────────────────────────────────────────────────
info "Installing dependencies..."
pnpm install

# ── Build libs & run codegen ──────────────────────────────────────────────────
info "Building shared libraries..."
pnpm run typecheck:libs

info "Running API codegen..."
pnpm --filter @workspace/api-spec run codegen

# ── Run DB migrations ─────────────────────────────────────────────────────────
info "Running database migrations..."
pnpm --filter @workspace/db run push || warn "DB push failed — check DATABASE_URL in .env"

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
warn "Make sure .env has all required keys filled in (DATABASE_URL, SESSION_SECRET)."
