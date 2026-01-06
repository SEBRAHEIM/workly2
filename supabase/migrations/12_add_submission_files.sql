-- Add submission_file_urls column to projects for creators to upload work
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS submission_file_urls text[] DEFAULT '{}';
