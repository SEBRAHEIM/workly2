-- Create transactions table for client payments
CREATE TABLE IF NOT EXISTS transactions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    creator_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
    amount numeric(10, 2) NOT NULL,
    currency text DEFAULT 'AED',
    status text CHECK (status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
    type text CHECK (type IN ('payment', 'refund', 'payout')) DEFAULT 'payment',
    stripe_session_id text,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Policies for clients
CREATE POLICY "Clients can view their own transactions" ON transactions
FOR SELECT USING (client_id = auth.uid());

-- Policies for creators (only if they are involved)
CREATE POLICY "Creators can view transactions involving them" ON transactions
FOR SELECT USING (creator_id = auth.uid());

-- Policies for admins
CREATE POLICY "Admins can view all transactions" ON transactions
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);
