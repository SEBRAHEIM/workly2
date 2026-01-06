-- Migration 24: Add cascading deletes to allow user deletion

-- 1. Projects
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_student_id_fkey;
ALTER TABLE projects ADD CONSTRAINT projects_student_id_fkey FOREIGN KEY (student_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_creator_id_fkey;
ALTER TABLE projects ADD CONSTRAINT projects_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_waiting_on_fkey;
ALTER TABLE projects ADD CONSTRAINT projects_waiting_on_fkey FOREIGN KEY (waiting_on) REFERENCES auth.users(id) ON DELETE SET NULL;

-- 2. Offers
ALTER TABLE offers DROP CONSTRAINT IF EXISTS offers_sender_id_fkey;
ALTER TABLE offers ADD CONSTRAINT offers_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- 3. Reviews
ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_student_id_fkey;
ALTER TABLE reviews ADD CONSTRAINT reviews_student_id_fkey FOREIGN KEY (student_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_creator_id_fkey;
ALTER TABLE reviews ADD CONSTRAINT reviews_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_project_id_fkey;
ALTER TABLE reviews ADD CONSTRAINT reviews_project_id_fkey FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;

-- 4. Portfolio Items
ALTER TABLE portfolio_items DROP CONSTRAINT IF EXISTS portfolio_items_creator_id_fkey;
ALTER TABLE portfolio_items ADD CONSTRAINT portfolio_items_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- 5. Notifications
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;
ALTER TABLE notifications ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 6. Project Events
ALTER TABLE project_events DROP CONSTRAINT IF EXISTS project_events_actor_id_fkey;
ALTER TABLE project_events ADD CONSTRAINT project_events_actor_id_fkey FOREIGN KEY (actor_id) REFERENCES auth.users(id) ON DELETE SET NULL;
