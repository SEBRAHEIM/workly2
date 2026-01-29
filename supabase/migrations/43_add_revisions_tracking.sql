-- Add revisions tracking to projects
ALTER TABLE projects ADD COLUMN IF NOT EXISTS revisions_total INTEGER DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS revisions_used INTEGER DEFAULT 0;
