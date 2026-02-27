-- Add admin_notified_overdue to projects to track notification status
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS admin_notified_overdue boolean DEFAULT false;
