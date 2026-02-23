-- Upgrade projects table for Deal Lifecycle
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS pricing_type text CHECK (pricing_type IN ('fixed', 'negotiable', 'package')),
ADD COLUMN IF NOT EXISTS current_terms jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS expires_at timestamptz,
ADD COLUMN IF NOT EXISTS closed_at timestamptz,
ADD COLUMN IF NOT EXISTS archived_at timestamptz,
ADD COLUMN IF NOT EXISTS waiting_on uuid REFERENCES auth.users(id);

-- Update status check constraint to include new statuses
-- We drop the old constraint and add a new one.
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_status_check;
ALTER TABLE projects ADD CONSTRAINT projects_status_check 
CHECK (status IN (
  'requested', 'negotiating', -- Old/Backward compat
  'pending', 'countered', 'accepted', 'agreed', 'in_progress', 'submitted', 'completed', -- Active
  'declined', 'cancelled', 'expired', 'archived' -- Closed
));

-- Create project_events table
CREATE TABLE IF NOT EXISTS project_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('offer_sent', 'counter_sent', 'accepted', 'declined', 'cancelled', 'expired', 'message_sent')),
  actor_id uuid REFERENCES auth.users(id),
  payload jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- RLS for project_events
ALTER TABLE project_events ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view events for projects they are involved in
CREATE POLICY "Users can view events for their projects" ON project_events
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM projects 
    WHERE projects.id = project_events.project_id 
    AND (projects.client_id = auth.uid() OR projects.creator_id = auth.uid())
  )
);

-- Policy: Users can insert events for their projects (handled by server actions mainly, but good for safety)
CREATE POLICY "Users can insert events for their projects" ON project_events
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM projects 
    WHERE projects.id = project_events.project_id 
    AND (projects.client_id = auth.uid() OR projects.creator_id = auth.uid())
  )
);
