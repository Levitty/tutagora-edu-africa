-- Make kyc-documents bucket public so admins can view documents
UPDATE storage.buckets 
SET public = true 
WHERE id = 'kyc-documents';