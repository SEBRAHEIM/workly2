-- Migration 54: Create support tickets table

CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- Policies
-- 1. Users can insert their own tickets
CREATE POLICY "Users can create their own tickets"
    ON support_tickets
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- 2. Users can view their own tickets
CREATE POLICY "Users can view their own tickets"
    ON support_tickets
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- 3. Admins can view and update all tickets (assuming 'hq' or 'admin' role logic exists in your app)
-- Since we use the profiles.role column for role checking:
CREATE POLICY "Admins can view all tickets"
    ON support_tickets
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'hq'
        )
    );

CREATE POLICY "Admins can update all tickets"
    ON support_tickets
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'hq'
        )
    );

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
