# SentraScope 🛰️

**India's satellite-powered environmental intelligence platform.**  
Real-time air quality, thermal fire hotspots, UV index, and urbanization analysis.

---

## What the App Does

| Feature | Description |
|---|---|
| 💨 **Air Quality** | Live AQI from WAQI/CPCB stations across India |
| 🔥 **Thermal Anomalies** | Active fire hotspots from NASA FIRMS (VIIRS satellite) |
| ☀️ **UV Index** | UV radiation levels per state via OpenUV |
| 🏙️ **Urbanization** | Land-use change analysis via Google Earth Engine |
| 🔐 **Auth** | Email/password accounts with JWT + email verification |
| 📊 **Reports** | Automated environmental reports with email delivery |
| 🚨 **Alerts** | Custom threshold-based environmental alerts |

---

## Quick Start (Local)

### Prerequisites

| Tool | Version | Install |
|---|---|---|
| Node.js | 20+ | https://nodejs.org |
| pnpm | 9+ | `npm install -g pnpm` |
| PostgreSQL | 14+ | Docker (recommended) or native |
| Docker | any | https://docker.com *(optional, for Postgres)* |

### 1. Run the automated setup

```bash
chmod +x setup.sh
./setup.sh
```

This will:
- Copy `.env.example` → `.env`
- Start PostgreSQL via Docker Compose
- Install all dependencies
- Build shared libraries
- Run database migrations

### 2. Fill in your API keys

Open `.env` and add your keys (see the [API Keys](#api-keys) section below):

```bash
# Required
DATABASE_URL=postgresql://sentrascope:sentrascope@localhost:5432/sentrascope
SESSION_SECRET=your-long-random-secret-here

# Optional (app works without these, features degrade gracefully)
WAQI_API_TOKEN=
NASA_FIRMS_MAP_KEY=
OPENUV_API_KEY=
INDIA_OGD_API_KEY=
BREVO_API_KEY=
```

### 3. Start the servers

Open **two terminals**:

```bash
# Terminal 1 — API server (port 8080)
pnpm --filter @workspace/api-server run dev

# Terminal 2 — Frontend (port 5173)
pnpm --filter @workspace/sentrascope run dev
```

Then open **http://localhost:5173** in your browser.

---

## API Keys

All keys are **optional** except `DATABASE_URL` and `SESSION_SECRET`.

| Key | Where to get it | Free tier? |
|---|---|---|
| `WAQI_API_TOKEN` | https://aqicn.org/api/ | ✅ Free |
| `NASA_FIRMS_MAP_KEY` | https://firms.modaps.eosdis.nasa.gov/api/ | ✅ Free |
| `OPENUV_API_KEY` | https://www.openuv.io/ | ✅ Free (50 req/day) |
| `INDIA_OGD_API_KEY` | https://data.gov.in/ | ✅ Free |
| `BREVO_API_KEY` | https://brevo.com | ✅ Free (300 emails/day) |
| `GEE_SERVICE_ACCOUNT_KEY` | https://earthengine.google.com | ✅ Free (approval required) |

---

## Project Structure

```
sentrascope/
├── frontend/                # React + Vite frontend (main app)
│   └── src/
│       ├── components/      # UI components
│       ├── pages/           # Route pages
│       └── hooks/           # Data fetching hooks
├── backend/                 # Express API (port 8080)
│   └── src/
│       ├── routes/          # All API endpoints
│       ├── lib/             # JWT, email, scheduler, etc.
│       ├── app.ts           # Express app setup
│       └── index.ts         # Entry point
├── database/                 # PostgreSQL + Drizzle ORM
│   └── src/schema/          # DB schema definitions
├── shared/
│   ├── api-spec/            # OpenAPI spec (source of truth)
│   ├── api-zod/             # Generated Zod validators
│   └── api-client-react/    # Generated React Query hooks
├── mockup-sandbox/          # Design/prototype sandbox
├── scripts/                 # Dev/maintenance scripts
├── docker-compose.yml       # Local PostgreSQL
├── .env.example             # Environment variable template
└── setup.sh                 # Automated setup script
```

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/healthz` | Health check |
| GET | `/api/config/status` | Which API keys are configured |
| POST | `/api/signup` | Create account |
| POST | `/api/login` | Login (returns JWT) |
| POST | `/api/logout` | Logout |
| GET | `/api/air-quality` | Air quality data |
| GET | `/api/thermal/fires` | Fire hotspots |
| GET | `/api/uv` | UV index |
| GET | `/api/india-ogd/air-quality` | CPCB data |
| GET | `/api/urbanization` | Urbanization analysis |

---

## Development Commands

```bash
# Install all dependencies
pnpm install

# Build shared TypeScript libs
pnpm run typecheck:libs

# Regenerate API hooks + Zod schemas from OpenAPI spec
pnpm --filter @workspace/api-spec run codegen

# Push DB schema changes (dev only)
pnpm --filter @workspace/db run push

# Full typecheck across all packages
pnpm run typecheck

# Build for production
pnpm run build
```

---

## Production Deployment

### Environment Variables (Production)

Set these in your hosting provider's secrets/env settings:

```bash
NODE_ENV=production
DATABASE_URL=postgresql://...
SESSION_SECRET=<64-char random string>
APP_URL=https://yourdomain.com
# ... other API keys
```

### Build & Start

```bash
pnpm install
pnpm run typecheck:libs
pnpm --filter @workspace/api-spec run codegen
pnpm --filter @workspace/api-server run build
pnpm --filter @workspace/sentrascope run build
pnpm --filter @workspace/api-server run start
```

---

## Troubleshooting

**Air quality / UV / fire data not loading**  
→ The respective API key is missing. The app runs in degraded mode — add the key to `.env`.

**"Cannot connect to database"**  
→ Make sure PostgreSQL is running (`docker compose up -d postgres`) and `DATABASE_URL` is correct.

**Email verification not working**  
→ Add `BREVO_API_KEY` to `.env`. Without it, verification links are printed to the API server console log.

**Urbanization map is empty**  
→ Google Earth Engine requires a service account. Leave `GEE_SERVICE_ACCOUNT_KEY` blank to hide the feature.

---

## Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Leaflet maps
- **Backend**: Express 5, Node.js 20+, TypeScript
- **Database**: PostgreSQL 16 + Drizzle ORM
- **Validation**: Zod + drizzle-zod
- **API**: OpenAPI spec → Orval codegen → React Query hooks + Zod schemas
- **Monorepo**: pnpm workspaces
