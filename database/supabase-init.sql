-- ============================================================================
-- SentraScope — Supabase schema initialization
-- Run this once in the Supabase SQL editor:
--   Supabase dashboard → SQL Editor → New query → paste → Run
--
-- Idempotent: safe to re-run. Mirrors the Drizzle schema in ./src/schema/.
-- If you change a column here, also update the matching Drizzle schema file.
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
  id                  BIGSERIAL PRIMARY KEY,
  name                TEXT NOT NULL,
  email               TEXT NOT NULL UNIQUE,
  password_hash       TEXT NOT NULL,
  email_verified      BOOLEAN NOT NULL DEFAULT false,
  verify_token        TEXT,
  verify_token_expiry TIMESTAMPTZ,
  reset_token         TEXT,
  reset_token_expiry  TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_verify_token
  ON users(verify_token) WHERE verify_token IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_users_reset_token
  ON users(reset_token) WHERE reset_token IS NOT NULL;

CREATE TABLE IF NOT EXISTS alert_settings (
  id         BIGSERIAL PRIMARY KEY,
  user_id    BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  daily      BOOLEAN NOT NULL DEFAULT true,
  weekly     BOOLEAN NOT NULL DEFAULT false,
  monthly    BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
