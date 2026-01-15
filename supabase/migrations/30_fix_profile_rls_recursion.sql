-- Migration 30: Fix Profile RLS Recursion
-- This migration introduces a SECURITY DEFINER function to check admin status,
-- which avoids the infinite recursion error in the profiles table's RLS policies.

-- 1. Create a security definer function to check if a user is an admin
-- Using security definer bypasses the RLS checks for the profiles table during the query.
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = user_id
    AND profiles.role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Clean up original recursive policies on the profiles table
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

-- 3. Re-implement Admin Profile access using the non-recursive function
CREATE POLICY "Admins can view all profiles"
ON profiles
FOR SELECT
TO authenticated
USING (
  public.is_admin(auth.uid())
  OR (auth.jwt() ->> 'email' = 'workly.day@outlook.com')
);

CREATE POLICY "Admins can update all profiles"
ON profiles
FOR UPDATE
TO authenticated
USING (
  public.is_admin(auth.uid())
  OR (auth.jwt() ->> 'email' = 'workly.day@outlook.com')
);

-- 4. Update Projects policy for consistency (not recursive but good practice)
DROP POLICY IF EXISTS "Admins have full access to all projects" ON projects;
CREATE POLICY "Admins have full access to all projects"
ON projects
FOR ALL
TO authenticated
USING (
  public.is_admin(auth.uid())
  OR (auth.jwt() ->> 'email' = 'workly.day@outlook.com')
);
