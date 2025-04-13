
-- Create storage bucket for profile images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile_images', 'Profile Images', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policy to allow authenticated users to upload their own images
CREATE POLICY "Allow users to upload their own images" ON storage.objects
FOR INSERT TO authenticated
USING (bucket_id = 'profile_images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to select (read) any public profile images
CREATE POLICY "Allow users to view all profile images" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'profile_images');

-- Allow users to update their own profile images
CREATE POLICY "Allow users to update their own images" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'profile_images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own profile images
CREATE POLICY "Allow users to delete their own images" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'profile_images' AND auth.uid()::text = (storage.foldername(name))[1]);
