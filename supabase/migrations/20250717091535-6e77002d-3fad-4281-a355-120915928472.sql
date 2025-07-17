
-- Fix the has_role function with proper type casting
DROP FUNCTION IF EXISTS public.has_role(uuid, unknown);
DROP FUNCTION IF EXISTS public.has_role(uuid, app_role);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = _user_id AND role = _role
  )
$$;

-- Update the RLS policies to fix the data visibility issues
DROP POLICY IF EXISTS "Super admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Super admins can update any profile" ON public.profiles;

-- Create simpler RLS policies that work
CREATE POLICY "Super admins can view all profiles" 
ON public.profiles FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role = 'super_admin'
  )
);

CREATE POLICY "Super admins can update any profile" 
ON public.profiles FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role = 'super_admin'
  )
);

-- Also fix KYC documents visibility for super admins
CREATE POLICY "Super admins can view all KYC documents" 
ON public.kyc_documents FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role = 'super_admin'
  )
);

CREATE POLICY "Super admins can update all KYC documents" 
ON public.kyc_documents FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role = 'super_admin'
  )
);
