-- Add languages column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS languages text[] DEFAULT '{English}';

-- Update RLS if needed (usually not needed for just adding a column if * is used in policies)
COMMENT ON COLUMN public.profiles.languages IS 'Languages the creator works in (e.g., English, Arabic)';
