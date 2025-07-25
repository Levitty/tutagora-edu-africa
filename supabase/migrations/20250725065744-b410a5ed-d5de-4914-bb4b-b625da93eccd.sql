-- Phase 1: Critical Role Security Fixes

-- 1. Create proper user_roles table with foreign key constraints
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  assigned_at TIMESTAMPTZ DEFAULT now(),
  assigned_by UUID REFERENCES auth.users(id),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 2. Fix database function security with proper search_path
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = 'super_admin'::app_role
  )
$$;

-- 3. Secure the handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
DECLARE
    user_role app_role;
BEGIN
    -- Input validation
    IF NEW.id IS NULL THEN
        RAISE EXCEPTION 'User ID cannot be null';
    END IF;
    
    -- Determine the role based on user_type with validation
    user_role := CASE 
        WHEN NEW.raw_user_meta_data ->> 'user_type' = 'tutor' THEN 'tutor'::app_role
        WHEN NEW.raw_user_meta_data ->> 'user_type' = 'admin' THEN 'super_admin'::app_role
        WHEN NEW.raw_user_meta_data ->> 'user_type' = 'super_admin' THEN 'super_admin'::app_role
        ELSE 'student'::app_role
    END;
    
    -- Insert the profile
    INSERT INTO public.profiles (
        id, 
        first_name, 
        last_name, 
        user_type, 
        phone, 
        country, 
        role
    ) VALUES (
        NEW.id,
        NEW.raw_user_meta_data ->> 'first_name',
        NEW.raw_user_meta_data ->> 'last_name',
        COALESCE(NEW.raw_user_meta_data ->> 'user_type', 'student'),
        NEW.raw_user_meta_data ->> 'phone',
        NEW.raw_user_meta_data ->> 'country',
        user_role
    ) ON CONFLICT (id) DO UPDATE SET
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        user_type = EXCLUDED.user_type,
        phone = EXCLUDED.phone,
        country = EXCLUDED.country,
        role = EXCLUDED.role;
    
    -- Insert into user_roles table
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, user_role)
    ON CONFLICT (user_id, role) DO NOTHING;
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log the error but don't block user creation
        RAISE WARNING 'Error in handle_new_user: %, SQLSTATE: %', SQLERRM, SQLSTATE;
        RETURN NEW;
END;
$$;

-- 4. Create RLS policies for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Super admins can manage all roles" ON public.user_roles
FOR ALL USING (is_super_admin(auth.uid()));

-- 5. Prevent users from modifying their own roles in profiles
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id AND 
  (OLD.role = NEW.role OR is_super_admin(auth.uid())) -- Only admins can change roles
);

-- 6. Phase 2: File Storage Security - Make KYC bucket private
UPDATE storage.buckets 
SET public = false 
WHERE id = 'kyc-documents';

-- Create proper storage policies for KYC documents
CREATE POLICY "Tutors can upload their own KYC documents" ON storage.objects
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
  is_super_admin(auth.uid())
);

CREATE POLICY "Super admins can delete KYC documents" ON storage.objects
FOR DELETE USING (
  bucket_id = 'kyc-documents' AND 
  is_super_admin(auth.uid())
);

-- 7. Create audit logging table for security events
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

-- 8. Create function for secure role assignment
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