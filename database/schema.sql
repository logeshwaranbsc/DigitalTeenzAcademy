-- ==============================================================================
-- Digital Teenz Academy — Supabase PostgreSQL Schema
-- Profiles table with RLS policies
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- TABLE: profiles
-- Application user profiles linked to Supabase Auth
-- ==============================================================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID NOT NULL UNIQUE,          -- References auth.users.id
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50) NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'student'
        CHECK (role IN ('admin', 'student', 'employee')),
    status VARCHAR(20) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'inactive')),
    avatar_url TEXT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_profiles_auth_user_id ON profiles(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_deleted_at ON profiles(deleted_at);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON profiles;
CREATE TRIGGER trigger_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_profiles_updated_at();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = auth_user_id);

-- Policy: Service role has full access (used by Laravel backend)
CREATE POLICY "Service role full access"
    ON profiles FOR ALL
    USING (auth.role() = 'service_role');

-- Policy: Authenticated users can read profiles (needed for admin listing)
-- The Laravel API enforces admin-only access, but RLS allows reads for authenticated users
CREATE POLICY "Authenticated users can read profiles"
    ON profiles FOR SELECT
    USING (auth.role() = 'authenticated');

-- ==============================================================================
-- NOTES:
-- 1. Do NOT create seed/demo users here
-- 2. Use 'php artisan admin:create' to create the initial admin
-- 3. All user creation goes through the Laravel API
-- 4. The service_role key is only used server-side (Laravel)
-- ==============================================================================
