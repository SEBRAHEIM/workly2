-- Add submitted_at and reported_issue to projects
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS submitted_at timestamptz,
ADD COLUMN IF NOT EXISTS reported_issue text;
