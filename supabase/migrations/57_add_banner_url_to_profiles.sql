-- Add banner_url to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS banner_url TEXT;
