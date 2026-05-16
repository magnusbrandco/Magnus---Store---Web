-- Storage bucket policies for images bucket

-- Ensure storage bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "public_read_images" ON storage.objects;
DROP POLICY IF EXISTS "admin_upload_all" ON storage.objects;
DROP POLICY IF EXISTS "admin_update_delete_all" ON storage.objects;

-- Allow public read access to images bucket
CREATE POLICY "public_read_images"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- Allow authenticated admins to upload to images bucket
CREATE POLICY "admin_upload_all"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'images'
  AND EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role IN ('admin', 'staff')
  )
);

-- Allow admins to update and delete in images bucket
CREATE POLICY "admin_update_delete_all"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'images'
  AND EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role IN ('admin', 'staff')
  )
)
WITH CHECK (
  bucket_id = 'images'
  AND EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role IN ('admin', 'staff')
  )
);

-- Allow admins to delete in images bucket
CREATE POLICY "admin_delete_all"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'images'
  AND EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role IN ('admin', 'staff')
  )
);
