-- Formalize Admin Role and Update RLS Policies
-- This ensures that users with the 'admin' role have full access to projects and profiles

-- 1. Ensure the 'admin' status is recognized in RLS
-- (Note: profiles already has a 'role' column)

-- 2. Update Projects RLS to allow 'admin' role access
CREATE POLICY "Admins have full access to all projects"
ON projects
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
  OR (auth.jwt() ->> 'email' = 'workly.day@outlook.com')
);

-- 3. Update Profiles RLS to allow 'admin' role access
DROP POLICY IF EXISTS "Super Admin can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles"
ON profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
  OR (auth.jwt() ->> 'email' = 'workly.day@outlook.com')
);

-- 4. Admins can update all profiles (for management)
CREATE POLICY "Admins can update all profiles"
ON profiles
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
  OR (auth.jwt() ->> 'email' = 'workly.day@outlook.com')
);
