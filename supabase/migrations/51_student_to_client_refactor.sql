
-- Migration: Client to Client Refactor
-- Description: Updates roles and column names across the database.

-- 1. Update Profile Role Constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('client', 'creator', 'admin'));

-- 2. Migrate existing client roles
UPDATE profiles SET role = 'client' WHERE role = 'client';

-- 3. Rename columns in projects
ALTER TABLE projects RENAME COLUMN client_id TO client_id;

-- 4. Rename columns in reviews
ALTER TABLE reviews RENAME COLUMN client_id TO client_id;

-- 5. Rename columns in transactions (if exists)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'transactions' AND column_name = 'client_id'
    ) THEN
        ALTER TABLE transactions RENAME COLUMN client_id TO client_id;
    END IF;
END $$;

-- 6. Rename columns in favorite_creators (if exists)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'favorite_creators' AND column_name = 'client_id'
    ) THEN
        ALTER TABLE favorite_creators RENAME COLUMN client_id TO client_id;
    END IF;
END $$;

-- 7. Update Policies (Drop and Re-create with new names)
-- Projects Policies
DROP POLICY IF EXISTS "Users can view their own projects" ON projects;
CREATE POLICY "Users can view their own projects" ON projects
    FOR SELECT USING (auth.uid() = client_id OR auth.uid() = creator_id);

DROP POLICY IF EXISTS "Clients can insert projects" ON projects;
CREATE POLICY "Clients can insert projects" ON projects
    FOR INSERT WITH CHECK (auth.uid() = client_id);

DROP POLICY IF EXISTS "Users can update their own projects" ON projects;
CREATE POLICY "Users can update their own projects" ON projects
    FOR UPDATE USING (auth.uid() = client_id OR auth.uid() = creator_id);

-- Review Policies
DROP POLICY IF EXISTS "Clients can write reviews for their completed projects" ON reviews;
CREATE POLICY "Clients can write reviews for their completed projects" ON reviews
    FOR INSERT WITH CHECK (auth.uid() = client_id);

-- Transactions Policies
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'transactions' AND policyname = 'Clients can view their own transactions') THEN
        DROP POLICY "Clients can view their own transactions" ON transactions;
        CREATE POLICY "Clients can view their own transactions" ON transactions
            FOR SELECT USING (client_id = auth.uid());
    END IF;
END $$;

-- Favorite Creators Policies
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'favorite_creators' AND policyname = 'Client can view their own favorites') THEN
        DROP POLICY "Client can view their own favorites" ON favorite_creators;
        CREATE POLICY "Client can view their own favorites" ON favorite_creators
            FOR SELECT USING (auth.uid() = client_id);
    END IF;
END $$;
