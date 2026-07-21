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
| Supabase account | free tier | https://supabase.com |

### 1. Create a Supabase project

1. Sign up at https://supabase.com and create a new project (free tier is fine).
2. Once the project is ready, open **Project Settings → Database → Connection string** and copy the **Direct connection** URI (port 5432 — *not* the pooler 6543). It looks like:
   ```
   postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
   ```
3. Open **SQL Editor → New query**, paste the contents of `database/supabase-init.sql`, and click **Run**. This creates the `users` and `alert_settings` tables. (Idempotent — safe to re-run.)

### 2. Run the automated setup

```bash
chmod +x setup.sh
./setup.sh
```

This will:
- Copy `.env.example` → `.env`
- Install all dependencies
- Build shared libraries

### 3. Fill in your keys

Open `.env` and add:

```bash
# Required — Supabase direct connection string from step 1
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
SESSION_SECRET=your-long-random-secret-here

# Optional (app works without these, features degrade gracefully)
WAQI_API_TOKEN=
NASA_FIRMS_MAP_KEY=
OPENUV_API_KEY=
INDIA_OGD_API_KEY=
BREVO_API_KEY=        # used for verification + password-reset + report emails (NOT for auth)
```

### 4. Start the servers

Open **two terminals**:

```bash
# Terminal 1 — API server (port 5000 by default; PORT in .env)
pnpm --filter @workspace/api-server run dev

# Terminal 2 — Frontend (port 5173)
pnpm --filter @workspace/sentrascope run dev
```

Then open **http://localhost:5173** in your browser.

---

## API Keys

All keys are **optional** except `DATABASE_URL` and `SESSION_SECRET`.

| Key | Where to get it | Used for |
|---|---|---|
| `DATABASE_URL` | Supabase dashboard → Database → Connection string | Stores users + alert settings (replaces the old local Postgres) |
| `SESSION_SECRET` | `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` | JWT signing key |
| `WAQI_API_TOKEN` | https://aqicn.org/api/ | Air quality data — free |
| `NASA_FIRMS_MAP_KEY` | https://firms.modaps.eosdis.nasa.gov/api/ | Thermal fire hotspots — free |
| `OPENUV_API_KEY` | https://www.openuv.io/ | UV index — free (50 req/day) |
| `INDIA_OGD_API_KEY` | https://data.gov.in/ | CPCB air quality — free |
| `BREVO_API_KEY` | https://brevo.com | Transactional email (verification, password reset, scheduled reports) — free (300 emails/day). Independent of Supabase — this project uses its own custom auth, not Supabase Auth. |
| `GEE_SERVICE_ACCOUNT_KEY` | https://earthengine.google.com | Urbanization — free (approval required) |

---

## Project Structure

```
sentrascope/
├── frontend/                # React + Vite frontend (main app)
│   └── src/
│       ├── components/      # UI components
│       ├── pages/           # Route pages
│       └── hooks/           # Data fetching hooks
├── backend/                 # Express API (port 5000)
│   └── src/
│       ├── routes/          # All API endpoints
│       ├── lib/             # JWT, email, scheduler, etc.
│       ├── app.ts           # Express app setup
│       └── index.ts         # Entry point
├── database/                 # Drizzle ORM schemas (mirrors Supabase tables)
│   ├── src/schema/          # Drizzle schema definitions
│   └── supabase-init.sql    # Run once in Supabase SQL editor to create tables
├── shared/
│   ├── api-spec/            # OpenAPI spec (source of truth)
│   ├── api-zod/             # Generated Zod validators
│   └── api-client-react/    # Generated React Query hooks
├── mockup-sandbox/          # Design/prototype sandbox
├── scripts/                 # Dev/maintenance scripts
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

# Apply Drizzle schema changes to Supabase (dev only)
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
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
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
→ Check `DATABASE_URL` in `.env`. It must be the Supabase **direct** connection string (port 5432), not the transaction pooler. Confirm the project isn't paused in the Supabase dashboard.

**Email verification not working**  
→ Add `BREVO_API_KEY` to `.env`. Without it, verification links are printed to the API server console log.

**Urbanization map is empty**  
→ Google Earth Engine requires a service account. Leave `GEE_SERVICE_ACCOUNT_KEY` blank to hide the feature.

---

## Stack

- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS, Leaflet maps
- **Backend**: Express 5, Node.js 20+, TypeScript
- **Database**: Supabase (PostgreSQL 15) + Drizzle ORM via `postgres.js`
- **Auth**: Custom email + password (bcrypt) with our own JWT — Supabase stores the rows, not the auth
- **Email**: Brevo for transactional + report emails
- **Validation**: Zod + drizzle-zod
- **API**: OpenAPI spec → Orval codegen → React Query hooks + Zod schemas
- **Monorepo**: pnpm workspaces
