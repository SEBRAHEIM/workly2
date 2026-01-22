-- ==========================================
-- CONSOLIDATED PAYOUT MIGRATIONS
-- Run this in your Supabase SQL Editor
-- ==========================================

-- 1. Add new payout fields to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS paypal_email TEXT,
ADD COLUMN IF NOT EXISTS skrill_email TEXT,
ADD COLUMN IF NOT EXISTS neteller_email TEXT;

COMMENT ON COLUMN public.profiles.paypal_email IS 'Creator preference for PayPal withdrawals';
COMMENT ON COLUMN public.profiles.skrill_email IS 'Creator preference for Skrill withdrawals';
COMMENT ON COLUMN public.profiles.neteller_email IS 'Creator preference for Neteller withdrawals';

-- 2. Update withdrawals method constraint to include paypal
ALTER TABLE public.withdrawals 
DROP CONSTRAINT IF EXISTS withdrawals_method_check;

ALTER TABLE public.withdrawals 
ADD CONSTRAINT withdrawals_method_check 
CHECK (method IN ('bank', 'skrill', 'neteller', 'card', 'paypal'));

-- 3. Add Admin RLS Policies for Withdrawals
CREATE POLICY "Admins can view all withdrawals"
ON withdrawals FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);

CREATE POLICY "Admins can update withdrawals"
ON withdrawals FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);
