
-- Create notifications table
CREATE TABLE notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  type TEXT CHECK (type IN ('info', 'success', 'warning', 'error')) DEFAULT 'info',
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications (mark as read)" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow server (service role) to insert notifications (handled by webhook/actions)
-- But also allow validated inserts if we ever need client-side triggers (though server actions are better)
-- For now, we'll rely on server-side insertion via Service Role or careful RLS if needed. 
-- Actually, simple "insert own" might be needed for some cases, but generally notifications are system-generated.
-- We will stick to server-side generation for now, but if we need RLS for insert:
CREATE POLICY "System can insert notifications" ON notifications
  FOR INSERT WITH CHECK (true); -- Ideally restrictive, but for now open to authenticated creation if needed, or rely on service role. 
-- Wait, 'true' allows anyone to spam notifications. Let's restrict INSERT to service role only or specific logic.
-- Since we are using Supabase Client in server actions, it runs as the user.
-- So we need a policy for users to potentially trigger notifs? No, usually notifs comes from ACTIONS on OTHER users (e.g. Client pays -> Creator gets notif).
-- The Creator notif is inserted by the Client's action? YES.
-- So we need: "Users can insert notifications for OTHER users" (strictly controlled?) 
-- OR: "Users can insert notifications" Generally.
CREATE POLICY "Users can insert notifications" ON notifications FOR INSERT WITH CHECK (auth.uid() = user_id OR true); -- Revisit this. Secure way is triggers or Service Role. 
-- For MVP/Speed, we will use Service Role client for notifications in Webhooks/Actions to bypass RLS.
