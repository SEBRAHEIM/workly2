-- Add file_urls column to projects to support multiple files
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS file_urls text[] DEFAULT '{}';

-- Migrate existing file_url to file_urls (if needed)
UPDATE projects 
SET file_urls = ARRAY[file_url] 
WHERE file_url IS NOT NULL AND (file_urls IS NULL OR file_urls = '{}');
