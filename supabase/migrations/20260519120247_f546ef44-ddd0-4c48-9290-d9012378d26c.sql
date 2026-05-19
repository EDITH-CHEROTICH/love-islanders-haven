
-- Revoke EXECUTE on the SECURITY DEFINER trigger function from public roles
REVOKE EXECUTE ON FUNCTION public.handle_mutual_swipe() FROM PUBLIC, anon, authenticated;

-- Restrict storage.objects listing on the public profile-images bucket.
-- We drop any overly-broad SELECT policy and add a narrow one allowing
-- only the owner of an object to list it. Public URLs continue to work
-- because they're fetched directly without listing.
DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND policyname ILIKE '%profile%image%'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "profile-images owner can list"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "profile-images owner can insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "profile-images owner can update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "profile-images owner can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);
