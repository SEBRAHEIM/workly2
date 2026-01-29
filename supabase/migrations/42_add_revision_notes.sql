-- Add revision_notes to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS revision_notes TEXT;
