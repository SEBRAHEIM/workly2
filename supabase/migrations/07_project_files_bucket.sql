-- Create a storage bucket for project files
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-files', 'project-files', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Authenticated users can upload
CREATE POLICY "Authenticated Upload Project Files"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'project-files' AND auth.role() = 'authenticated' );

-- Policy: Public/Authenticated Read (Students and Creators need to see it)
-- For simplicity, we make it public or at least readable by authenticated
CREATE POLICY "Authenticated Read Project Files"
ON storage.objects FOR SELECT
USING ( bucket_id = 'project-files' AND auth.role() = 'authenticated' );
