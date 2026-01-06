-- Normalize pricing_type in projects table to match creator_services
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_pricing_type_check;
ALTER TABLE projects ADD CONSTRAINT projects_pricing_type_check
CHECK (pricing_type IN ('fixed', 'negotiable', 'packages'));
