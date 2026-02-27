-- Add is_busy to profiles for creators to toggle availability
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_busy boolean DEFAULT false;
