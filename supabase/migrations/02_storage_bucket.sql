-- Create a storage bucket for portfolio items
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Public can view portfolio images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'portfolio' );

-- Policy: Authenticated users can upload to portfolio
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'portfolio' AND auth.role() = 'authenticated' );

-- Policy: Users can delete their own files (optional but good)
CREATE POLICY "Owner Delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'portfolio' AND auth.uid() = owner );
