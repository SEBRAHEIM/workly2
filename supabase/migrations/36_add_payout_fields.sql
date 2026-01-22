-- Add payout fields to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS paypal_email TEXT,
ADD COLUMN IF NOT EXISTS skrill_email TEXT,
ADD COLUMN IF NOT EXISTS neteller_email TEXT;

-- Update RLS if needed (though usually profiles are already protected)
COMMENT ON COLUMN public.profiles.paypal_email IS 'Creator preference for PayPal withdrawals';
COMMENT ON COLUMN public.profiles.skrill_email IS 'Creator preference for Skrill withdrawals';
COMMENT ON COLUMN public.profiles.neteller_email IS 'Creator preference for Neteller withdrawals';
