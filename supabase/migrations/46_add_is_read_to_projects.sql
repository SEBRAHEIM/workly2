-- Add is_read to projects for dashboard highlighting
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS is_read boolean DEFAULT false;

-- Mark all existing projects as read to prevent noise
UPDATE projects SET is_read = true;
