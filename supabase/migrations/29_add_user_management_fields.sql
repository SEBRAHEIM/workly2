-- Add verification and status columns to profiles
-- This enables administrative control over user accounts

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS status text CHECK (status IN ('active', 'suspended', 'banned')) DEFAULT 'active';

-- Update RLS to ensure suspended/banned users have limited access (optional but recommended)
-- For now, we'll just keep the columns for administrative use.
