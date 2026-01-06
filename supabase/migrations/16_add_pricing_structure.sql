-- Add Pricing Structure Columns

alter table profiles
add column if not exists pricing_mode text check (pricing_mode in ('fixed', 'negotiable', 'packages')) default 'fixed',
add column if not exists base_price integer, -- Used for "Fixed Price" or "Starting at" price
add column if not exists currency text default 'USD',
add column if not exists service_packages jsonb default '{
  "basic": { "title": "Basic", "price": 50, "description": "Basic service", "delivery_days": 3, "revisions": 1 },
  "standard": { "title": "Standard", "price": 100, "description": "Standard service", "delivery_days": 5, "revisions": 2 },
  "premium": { "title": "Premium", "price": 200, "description": "Premium service", "delivery_days": 7, "revisions": 3 }
}'::jsonb;
