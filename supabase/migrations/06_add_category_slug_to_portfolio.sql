-- Add category_slug to portfolio_items for filtering
ALTER TABLE portfolio_items 
ADD COLUMN IF NOT EXISTS category_slug text;

-- Optional: Update existing items or set not null constraint if needed later
-- UPDATE portfolio_items SET category_slug = 'other' WHERE category_slug IS NULL;
-- ALTER TABLE portfolio_items ALTER COLUMN category_slug SET NOT NULL;
