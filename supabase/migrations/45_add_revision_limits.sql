-- Add revision limits and turnaround to projects
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS revisions_total int DEFAULT 0,
ADD COLUMN IF NOT EXISTS revision_turnaround int DEFAULT 2;

-- Comment for clarity
COMMENT ON COLUMN projects.revisions_total IS 'Number of revision rounds included in the selected package';
COMMENT ON COLUMN projects.revision_turnaround IS 'Number of days allowed per revision response';
