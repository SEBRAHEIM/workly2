-- 1. Create payout_batches table first
CREATE TABLE IF NOT EXISTS payout_batches (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    period_start timestamptz NOT NULL,
    period_end timestamptz NOT NULL,
    total_gross numeric NOT NULL DEFAULT 0,
    total_creator_net numeric NOT NULL DEFAULT 0,
    total_workly_fee numeric NOT NULL DEFAULT 0,
    total_stripe_fee numeric NOT NULL DEFAULT 0,
    status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'paid')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 2. Create or Update transactions table
-- If it doesn't exist, create it with full schema
CREATE TABLE IF NOT EXISTS transactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
    creator_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
    gross_amount numeric,
    workly_fee_amount numeric,
    stripe_fee_amount numeric,
    creator_net_amount numeric,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'refunded', 'disputed')),
    payout_batch_id uuid REFERENCES payout_batches(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 3. Add missing columns to transactions if it already existed
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='transactions' AND column_name='gross_amount') THEN
        ALTER TABLE transactions ADD COLUMN gross_amount numeric;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='transactions' AND column_name='workly_fee_amount') THEN
        ALTER TABLE transactions ADD COLUMN workly_fee_amount numeric;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='transactions' AND column_name='stripe_fee_amount') THEN
        ALTER TABLE transactions ADD COLUMN stripe_fee_amount numeric;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='transactions' AND column_name='creator_net_amount') THEN
        ALTER TABLE transactions ADD COLUMN creator_net_amount numeric;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='transactions' AND column_name='payout_batch_id') THEN
        ALTER TABLE transactions ADD COLUMN payout_batch_id uuid REFERENCES payout_batches(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 4. Enable RLS
ALTER TABLE payout_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- 5. Admin policies (Cleanup old ones if re-running)
DROP POLICY IF EXISTS "Admins can manage all payout batches" ON payout_batches;
CREATE POLICY "Admins can manage all payout batches"
ON payout_batches FOR ALL
TO authenticated
USING (auth.jwt() ->> 'email' = 'workly.day@outlook.com');

DROP POLICY IF EXISTS "Admins can manage all transactions" ON transactions;
CREATE POLICY "Admins can manage all transactions"
ON transactions FOR ALL
TO authenticated
USING (auth.jwt() ->> 'email' = 'workly.day@outlook.com');

DROP POLICY IF EXISTS "Creators can view their own transactions" ON transactions;
CREATE POLICY "Creators can view their own transactions"
ON transactions FOR SELECT
TO authenticated
USING (auth.uid() = creator_id);

-- 6. Updated_at triggers (Using existing function)
DROP TRIGGER IF EXISTS update_payout_batches_updated_at ON payout_batches;
CREATE TRIGGER update_payout_batches_updated_at
BEFORE UPDATE ON payout_batches
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_transactions_updated_at ON transactions;
CREATE TRIGGER update_transactions_updated_at
BEFORE UPDATE ON transactions
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 7. Add index for performance
CREATE INDEX IF NOT EXISTS idx_transactions_creator_id ON transactions(creator_id);
CREATE INDEX IF NOT EXISTS idx_transactions_payout_batch_id ON transactions(payout_batch_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
