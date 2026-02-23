
-- Migration: Update Category Slugs
-- Description: Renames academic slugs to professional ones for consistency.

-- 1. Update profiles specializations (Postgres array replacement)
UPDATE profiles 
SET 
  specializations = array_replace(array_replace(array_replace(array_replace(array_replace(array_replace(
    specializations, 
    'reports-essays', 'strategy-reports'), 
    'presentations-ppt', 'visual-presentations'), 
    'group-projects', 'team-collaboration'), 
    'excel-data', 'data-analytics'), 
    'programming-tech', 'tech-development'), 
    'other-tasks', 'special-projects')
WHERE specializations IS NOT NULL;

-- 2. Update portfolio_items
UPDATE portfolio_items SET category_slug = 'strategy-reports' WHERE category_slug = 'reports-essays';
UPDATE portfolio_items SET category_slug = 'visual-presentations' WHERE category_slug = 'presentations-ppt';
UPDATE portfolio_items SET category_slug = 'team-collaboration' WHERE category_slug = 'group-projects';
UPDATE portfolio_items SET category_slug = 'data-analytics' WHERE category_slug = 'excel-data';
UPDATE portfolio_items SET category_slug = 'tech-development' WHERE category_slug = 'programming-tech';
UPDATE portfolio_items SET category_slug = 'special-projects' WHERE category_slug = 'other-tasks';

-- 3. Update creator_services (if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'creator_services') THEN
        UPDATE creator_services SET category_slug = 'strategy-reports' WHERE category_slug = 'reports-essays';
        UPDATE creator_services SET category_slug = 'visual-presentations' WHERE category_slug = 'presentations-ppt';
        UPDATE creator_services SET category_slug = 'team-collaboration' WHERE category_slug = 'group-projects';
        UPDATE creator_services SET category_slug = 'data-analytics' WHERE category_slug = 'excel-data';
        UPDATE creator_services SET category_slug = 'tech-development' WHERE category_slug = 'programming-tech';
        UPDATE creator_services SET category_slug = 'special-projects' WHERE category_slug = 'other-tasks';
    END IF;
END $$;
