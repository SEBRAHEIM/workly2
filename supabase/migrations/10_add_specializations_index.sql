-- Add GIN index to specificializations array column for faster filtering
CREATE INDEX IF NOT EXISTS idx_profiles_specializations ON profiles USING GIN (specializations);
