-- Standardizing Admin Oversight & Fixing RLS Visibility
-- This migration ensures the Admin (workly.day@outlook.com) can see everything,
-- bypassing any client/creator specific restrictions.

-- 1. Ensure projects are visible to Admin
DROP POLICY IF EXISTS "Admins can view all projects" ON projects;
CREATE POLICY "Admins can view all projects"
ON projects FOR SELECT
TO authenticated
USING (
  public.is_admin(auth.uid())
  OR (auth.jwt() ->> 'email' = 'workly.day@outlook.com')
);

DROP POLICY IF EXISTS "Admins can update all projects" ON projects;
CREATE POLICY "Admins can update all projects"
ON projects FOR UPDATE
TO authenticated
USING (
  public.is_admin(auth.uid())
  OR (auth.jwt() ->> 'email' = 'workly.day@outlook.com')
);

-- 2. Ensure transactions are visible to Admin
DROP POLICY IF EXISTS "Admins can view all transactions" ON transactions;
CREATE POLICY "Admins can view all transactions"
ON transactions FOR SELECT
TO authenticated
USING (
  public.is_admin(auth.uid())
  OR (auth.jwt() ->> 'email' = 'workly.day@outlook.com')
);

-- 3. Ensure withdrawals are visible to Admin
DROP POLICY IF EXISTS "Admins can view all withdrawals" ON withdrawals;
CREATE POLICY "Admins can view all withdrawals"
ON withdrawals FOR SELECT
TO authenticated
USING (
  public.is_admin(auth.uid())
  OR (auth.jwt() ->> 'email' = 'workly.day@outlook.com')
);

-- 4. Ensure payout batches are visible to Admin
DROP POLICY IF EXISTS "Admins can view all payout batches" ON payout_batches;
CREATE POLICY "Admins can view all payout batches"
ON payout_batches FOR SELECT
TO authenticated
USING (
  public.is_admin(auth.uid())
  OR (auth.jwt() ->> 'email' = 'workly.day@outlook.com')
);

DROP POLICY IF EXISTS "Admins can manage payout batches" ON payout_batches;
CREATE POLICY "Admins can manage payout batches"
ON payout_batches FOR ALL
TO authenticated
USING (
  public.is_admin(auth.uid())
  OR (auth.jwt() ->> 'email' = 'workly.day@outlook.com')
);
