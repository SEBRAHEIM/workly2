-- Add Payment & Escrow fields to Projects
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS due_date timestamptz,
ADD COLUMN IF NOT EXISTS funds_status text CHECK (funds_status IN ('pending', 'escrow', 'released', 'refunded')) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_intent_id text;

-- Add Wallet Balance to Profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS wallet_balance numeric(10, 2) DEFAULT 0.00;
