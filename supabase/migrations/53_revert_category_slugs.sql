
-- Migration: Revert Category Slugs
-- Description: Reverts professional slugs back to original academic ones.

-- 1. Update profiles specializations
UPDATE profiles 
SET 
  specializations = array_replace(array_replace(array_replace(array_replace(array_replace(array_replace(
    specializations, 
    'strategy-reports', 'reports-essays'), 
    'visual-presentations', 'presentations-ppt'), 
    'team-collaboration', 'group-projects'), 
    'data-analytics', 'excel-data'), 
    'tech-development', 'programming-tech'), 
    'special-projects', 'other-tasks')
WHERE specializations IS NOT NULL;

-- 2. Update portfolio_items
UPDATE portfolio_items SET category_slug = 'reports-essays' WHERE category_slug = 'strategy-reports';
UPDATE portfolio_items SET category_slug = 'presentations-ppt' WHERE category_slug = 'visual-presentations';
UPDATE portfolio_items SET category_slug = 'group-projects' WHERE category_slug = 'team-collaboration';
UPDATE portfolio_items SET category_slug = 'excel-data' WHERE category_slug = 'data-analytics';
UPDATE portfolio_items SET category_slug = 'programming-tech' WHERE category_slug = 'tech-development';
UPDATE portfolio_items SET category_slug = 'other-tasks' WHERE category_slug = 'special-projects';

-- 3. Update creator_services (if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'creator_services') THEN
        UPDATE creator_services SET category_slug = 'reports-essays' WHERE category_slug = 'strategy-reports';
        UPDATE creator_services SET category_slug = 'presentations-ppt' WHERE category_slug = 'visual-presentations';
        UPDATE creator_services SET category_slug = 'group-projects' WHERE category_slug = 'team-collaboration';
        UPDATE creator_services SET category_slug = 'excel-data' WHERE category_slug = 'data-analytics';
        UPDATE creator_services SET category_slug = 'programming-tech' WHERE category_slug = 'tech-development';
        UPDATE creator_services SET category_slug = 'other-tasks' WHERE category_slug = 'special-projects';
    END IF;
END $$;
