-- Update withdrawals method constraint to include paypal
ALTER TABLE public.withdrawals 
DROP CONSTRAINT IF EXISTS withdrawals_method_check;

ALTER TABLE public.withdrawals 
ADD CONSTRAINT withdrawals_method_check 
CHECK (method IN ('bank', 'skrill', 'neteller', 'card', 'paypal'));
