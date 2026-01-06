-- Create a storage bucket for project deliverables
INSERT INTO storage.buckets (id, name, public)
VALUES ('deliverables', 'deliverables', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Authenticated users can upload to deliverables
CREATE POLICY "Authenticated Upload Deliverables"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'deliverables' AND auth.role() = 'authenticated' );

-- Policy: Public can view deliverables (since we use public URLs for simplicity in this MVP)
-- In a real app, we'd use signed URLs and private buckets.
CREATE POLICY "Public View Deliverables"
ON storage.objects FOR SELECT
USING ( bucket_id = 'deliverables' );
