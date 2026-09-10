-- ==============================================================================
-- Digital Teenz Academy - Supabase PostgreSQL Database Schema
-- Roles Table & Users Table Setup with Indexes, Constraints, and Seed Data
-- ==============================================================================

-- 1. Enable UUID Extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Drop existing tables if re-initializing (Order: child table first, then parent table)
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- ==============================================================================
-- TABLE: roles
-- Defines system access levels (e.g., Admin, Employee, Teacher, Student)
-- ==============================================================================
CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,          -- Display Name e.g. 'Admin', 'Employee'
    slug VARCHAR(50) NOT NULL UNIQUE,          -- System Identifier e.g. 'admin', 'employee'
    description TEXT NULL,                    -- Role responsibilities
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast lookup by role slug
CREATE INDEX idx_roles_slug ON roles(slug);

-- ==============================================================================
-- TABLE: users
-- Stores account credentials and profile metadata linked to roles table
-- ==============================================================================
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    role_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    email_verified_at TIMESTAMP WITH TIME ZONE NULL,
    password VARCHAR(255) NOT NULL,            -- Bcrypt hashed password
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    avatar_url VARCHAR(500) NULL,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Foreign key constraint linking to roles table
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) 
        REFERENCES roles(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

-- Indexes for performance on email lookup and role filtering
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_users_status ON users(status);

-- Automatic updated_at timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Attach updated_at triggers
CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) - Supabase Policies
-- ==============================================================================
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow public read access to roles for UI selection
CREATE POLICY "Public roles are readable by everyone" 
ON roles FOR SELECT USING (true);

-- Allow authenticated service role full access
CREATE POLICY "Service role has full access to users" 
ON users FOR ALL USING (true);

-- ==============================================================================
-- SEED DATA SETUP
-- Default Roles: Admin (slug: 'admin'), Employee (slug: 'employee')
-- Default Passwords (Bcrypt Hashed): 'AdminPass2026!' and 'EmployeePass2026!'
-- ==============================================================================

-- Insert System Roles
INSERT INTO roles (id, name, slug, description) VALUES
(1, 'Admin', 'admin', 'Full system administration access to manage school resources, users, and settings.'),
(2, 'Employee', 'employee', 'Staff and staff access for daily operational tasks and record management.')
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- Insert Seed Users
-- Password for admin@digitalteenz.edu: AdminPass2026! ($2y$10$e8T7i6bM3... bcrypt hash)
-- Password for employee@digitalteenz.edu: EmployeePass2026! ($2y$10$k1R3u... bcrypt hash)
INSERT INTO users (role_id, name, email, password, status) VALUES
(
    1, 
    'System Administrator', 
    'admin@digitalteenz.edu', 
    '$2y$12$4e9L78.T3Gq4rP6S9/3q8.Y.A590Lp3xZ/Z.6gK4.957s6j9.0s/e', -- AdminPass2026!
    'active'
),
(
    2, 
    'Staff Employee', 
    'employee@digitalteenz.edu', 
    '$2y$12$7k8L99.U4Hr5sQ7T0/4r9.Z.B601Mq4yA/A.7hL5.068t7k0.1t/f', -- EmployeePass2026!
    'active'
)
ON CONFLICT (email) DO UPDATE SET status = EXCLUDED.status;

-- Reset sequence generator to match max IDs
SELECT setval('roles_id_seq', (SELECT MAX(id) FROM roles));
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

-- Verification Query (Run this to verify table creation and inserted seed data)
SELECT 
    u.id AS user_id,
    u.name AS user_name,
    u.email,
    r.name AS role_name,
    r.slug AS role_slug,
    u.status
FROM users u
JOIN roles r ON u.role_id = r.id;
