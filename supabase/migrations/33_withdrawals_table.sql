-- Add Skrill and Neteller fields to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS skrill_email text,
ADD COLUMN IF NOT EXISTS neteller_email text;

-- Create withdrawals table
CREATE TABLE IF NOT EXISTS withdrawals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    amount numeric NOT NULL CHECK (amount > 0),
    currency text DEFAULT 'AED',
    method text NOT NULL CHECK (method IN ('bank', 'skrill', 'neteller', 'card')),
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'rejected')),
    details jsonb DEFAULT '{}'::jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;

-- Policies for creators to see their own withdrawals
CREATE POLICY "Creators can view their own withdrawals"
ON withdrawals FOR SELECT
TO authenticated
USING (auth.uid() = creator_id);

-- Policies for creators to insert their own withdrawals
CREATE POLICY "Creators can request withdrawals"
ON withdrawals FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = creator_id);

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_withdrawals_updated_at
BEFORE UPDATE ON withdrawals
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
