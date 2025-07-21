-- Create the kyc-documents storage bucket that's missing
INSERT INTO storage.buckets (id, name, public) 
VALUES ('kyc-documents', 'kyc-documents', false);

-- Create storage policies for KYC documents
CREATE POLICY "Tutors can upload their KYC documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'kyc-documents' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Tutors can view their own KYC documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'kyc-documents' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Super admins can view all KYC documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'kyc-documents' AND 
    public.is_super_admin(auth.uid())
  );