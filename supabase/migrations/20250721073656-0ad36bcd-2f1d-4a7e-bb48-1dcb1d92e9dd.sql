-- Add missing storage policies for KYC documents (bucket already exists)
CREATE POLICY "Super admins can view all KYC documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'kyc-documents' AND 
    public.is_super_admin(auth.uid())
  );