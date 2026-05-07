-- ============================================================
-- Inventory Management System — Supabase PostgreSQL Schema
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── USERS TABLE ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ─── PRODUCTS TABLE ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  description TEXT DEFAULT '',
  price       NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (price >= 0),
  quantity    INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  category    TEXT NOT NULL,
  image_url   TEXT,
  created_by  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for filtering / searching
CREATE INDEX IF NOT EXISTS idx_products_category   ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_by ON products(created_by);
CREATE INDEX IF NOT EXISTS idx_products_name       ON products USING gin(to_tsvector('english', name));

-- ─── AUTO-UPDATE updated_at ──────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────
-- We use the service role key on the backend, so RLS is optional.
-- Enable RLS as an extra safety layer if you ever expose the anon key.
ALTER TABLE users    ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow service role to bypass RLS (default Supabase behavior)
-- Public read for products (frontend uses JWT-protected API, not direct Supabase)
CREATE POLICY "service_role_all_users"    ON users    FOR ALL USING (true);
CREATE POLICY "service_role_all_products" ON products FOR ALL USING (true);

-- ─── STORAGE BUCKET ──────────────────────────────────────────
-- Run in SQL Editor OR create manually in Storage tab:
-- Bucket name: product-images  |  Public: true
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: allow authenticated uploads
CREATE POLICY "authenticated_upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- ─── SEED DATA (optional) ────────────────────────────────────
-- Insert a default admin user (password: Admin@123)
-- Generate hash via: node -e "const b=require('bcryptjs');b.hash('Admin@123',12).then(console.log)"
-- Then replace the hash below:
/*
INSERT INTO users (email, name, password_hash, role) VALUES
  ('admin@inventory.com', 'Admin User', '$2a$12:REPLACE_WITH_REAL_HASH', 'admin')
ON CONFLICT (email) DO NOTHING;
*/
