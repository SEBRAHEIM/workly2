-- Update the payout_preference column constraint to allow 'paypal'
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_payout_preference_check;

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_payout_preference_check 
CHECK (payout_preference IN ('stripe', 'bank', 'paypal'));
