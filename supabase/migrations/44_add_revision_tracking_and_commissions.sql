-- Add revision due date and commission fields to projects
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS revision_due_date timestamptz,
ADD COLUMN IF NOT EXISTS commission_rate numeric DEFAULT 0.20,
ADD COLUMN IF NOT EXISTS commission_amount numeric,
ADD COLUMN IF NOT EXISTS net_earnings numeric;

-- Comment for clarity
COMMENT ON COLUMN projects.revision_due_date IS 'Deadline for the current revision round';
COMMENT ON COLUMN projects.commission_rate IS 'Platform commission percentage (default 0.20 for 20%)';
