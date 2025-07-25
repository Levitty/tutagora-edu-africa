-- Continue with remaining security fixes
-- 1. Create audit logging table for security events
CREATE TABLE IF NOT EXISTS public.security_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  event_type TEXT NOT NULL,
  event_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.security_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins can view audit logs" ON public.security_audit
FOR SELECT USING (is_super_admin(auth.uid()));

-- 2. Create function for secure role assignment
CREATE OR REPLACE FUNCTION public.assign_user_role(
  target_user_id UUID,
  new_role app_role
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only super admins can assign roles
  IF NOT is_super_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Insufficient permissions to assign roles';
  END IF;
  
  -- Validate target user exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = target_user_id) THEN
    RAISE EXCEPTION 'Target user does not exist';
  END IF;
  
  -- Insert or update role
  INSERT INTO public.user_roles (user_id, role, assigned_by)
  VALUES (target_user_id, new_role, auth.uid())
  ON CONFLICT (user_id, role) DO UPDATE SET
    assigned_at = now(),
    assigned_by = auth.uid();
  
  -- Update profiles table for consistency
  UPDATE public.profiles 
  SET role = new_role, updated_at = now()
  WHERE id = target_user_id;
  
  -- Log the action
  INSERT INTO public.security_audit (user_id, event_type, event_data)
  VALUES (
    auth.uid(),
    'role_assignment',
    jsonb_build_object(
      'target_user_id', target_user_id,
      'new_role', new_role,
      'assigned_by', auth.uid()
    )
  );
  
  RETURN true;
END;
$$;

-- 3. Create secure storage policies for KYC documents
DROP POLICY IF EXISTS "Tutors can upload their own KYC documents" ON storage.objects;
CREATE POLICY "Tutors can upload their own KYC documents" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'kyc-documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "Tutors can view their own KYC documents" ON storage.objects;
CREATE POLICY "Tutors can view their own KYC documents" ON storage.objects
FOR SELECT USING (
  bucket_id = 'kyc-documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "Super admins can view all KYC documents" ON storage.objects;
CREATE POLICY "Super admins can view all KYC documents" ON storage.objects
FOR SELECT USING (
  bucket_id = 'kyc-documents' AND 
  is_super_admin(auth.uid())
);

DROP POLICY IF EXISTS "Super admins can delete KYC documents" ON storage.objects;
CREATE POLICY "Super admins can delete KYC documents" ON storage.objects
FOR DELETE USING (
  bucket_id = 'kyc-documents' AND 
  is_super_admin(auth.uid())
);