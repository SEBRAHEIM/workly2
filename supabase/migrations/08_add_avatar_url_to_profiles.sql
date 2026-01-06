-- Add avatar_url to profiles for user images
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS avatar_url text;
