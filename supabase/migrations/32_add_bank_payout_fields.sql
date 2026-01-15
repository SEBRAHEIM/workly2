-- Add bank payout fields to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS bank_account_name text,
ADD COLUMN IF NOT EXISTS bank_iban text,
ADD COLUMN IF NOT EXISTS bank_name text,
ADD COLUMN IF NOT EXISTS payout_preference text CHECK (payout_preference IN ('stripe', 'bank')) DEFAULT 'stripe';
