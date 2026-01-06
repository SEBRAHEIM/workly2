-- Add submission fields to projects table
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS submission_url text,
ADD COLUMN IF NOT EXISTS submission_notes text;

-- Add 'work_submitted' to event types check constraint if using one (though typically text is loose, but let's be safe if we rely on it)
-- In previous migration we did: CHECK (type IN (...))
-- We should update that constraint if we want to be strict, or just insert it.
-- Based on error logs or 'text' type, strict check might fail.
-- Let's update the constraint to be safe.
ALTER TABLE project_events DROP CONSTRAINT IF EXISTS project_events_type_check;
ALTER TABLE project_events ADD CONSTRAINT project_events_type_check
CHECK (type IN (
    'offer_sent', 'counter_sent', 'accepted', 'declined', 'cancelled', 'expired', 'message_sent',
    'work_submitted' -- NEW
));
