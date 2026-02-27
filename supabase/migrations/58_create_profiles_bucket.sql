-- Create a storage bucket for profile images (avatars, banners)
INSERT INTO storage.buckets (id, name, public)
VALUES ('profiles', 'profiles', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Public can view profiles images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'profiles' );

-- Policy: Authenticated users can upload to profiles
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'profiles' AND auth.role() = 'authenticated' );

-- Policy: Users can delete their own files
CREATE POLICY "Owner Delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'profiles' AND auth.uid() = owner );
