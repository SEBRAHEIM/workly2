-- Database Optimization Migration
-- Goal: Significantly speed up frequently used queries

-- 1. Index for project queries (Dashboard and Details)
CREATE INDEX IF NOT EXISTS idx_projects_student_id ON projects (student_id);
CREATE INDEX IF NOT EXISTS idx_projects_creator_id ON projects (creator_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects (status);

-- 2. Index for role filtering (Navigation and Access Control)
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles (role);

-- 3. Index for favorite creators (Creator Listings)
CREATE INDEX IF NOT EXISTS idx_favorite_creators_student_id ON favorite_creators (student_id);

-- 4. Index for profile search/listing
CREATE INDEX IF NOT EXISTS idx_profiles_display_name ON profiles (display_name);
