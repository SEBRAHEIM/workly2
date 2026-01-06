
-- Add identity fields to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS display_name text,
ADD COLUMN IF NOT EXISTS tagline text;
