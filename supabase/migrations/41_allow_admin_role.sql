-- Update profiles table to allow 'admin' role
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('student', 'creator', 'admin'));

-- Ensure RLS policies allow admin user to manage profiles (already exists in 28_formalize_admin_role.sql but reinforced here)
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
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
