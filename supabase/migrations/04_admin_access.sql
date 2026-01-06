-- Admin RLS Policies
-- Grants full access to 'projects' and 'profiles' for the Super Admin

CREATE POLICY "Super Admin can view all projects"
ON projects
FOR SELECT
USING (auth.jwt() ->> 'email' = 'workly.day@outlook.com');

CREATE POLICY "Super Admin can update all projects"
ON projects
FOR UPDATE
USING (auth.jwt() ->> 'email' = 'workly.day@outlook.com');

CREATE POLICY "Super Admin can view all profiles"
ON profiles
FOR SELECT
USING (auth.jwt() ->> 'email' = 'workly.day@outlook.com');
