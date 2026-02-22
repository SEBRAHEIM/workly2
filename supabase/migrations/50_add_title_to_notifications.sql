-- Add title column to notifications table
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS title TEXT;

-- Update existing notifications to have a default title based on their type
UPDATE notifications SET title = INITCAP(type) || ' Notification' WHERE title IS NULL;
