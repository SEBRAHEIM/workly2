-- Add revision_requested to project status check
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_status_check;
ALTER TABLE projects ADD CONSTRAINT projects_status_check 
CHECK (status IN (
  'requested', 'negotiating',
  'pending', 'countered', 'accepted', 'agreed', 'in_progress', 'submitted', 'completed',
  'revision_requested', -- NEW
  'declined', 'cancelled', 'expired', 'archived' 
));

-- Add revision_requested to project_events type check
ALTER TABLE project_events DROP CONSTRAINT IF EXISTS project_events_type_check;
ALTER TABLE project_events ADD CONSTRAINT project_events_type_check
CHECK (type IN (
    'offer_sent', 'counter_sent', 'accepted', 'declined', 'cancelled', 'expired', 'message_sent',
    'work_submitted',
    'revision_requested', -- NEW
    'completed' -- NEW
));
