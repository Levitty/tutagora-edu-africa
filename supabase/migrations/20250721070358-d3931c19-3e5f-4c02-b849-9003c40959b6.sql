-- Fix infinite recursion in RLS policies
-- Drop problematic policies first
DROP POLICY IF EXISTS "Super admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Super admins can update any profile" ON public.profiles;

-- Create safer policies without recursion
CREATE POLICY "Super admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Super admins can update any profile" 
ON public.profiles 
FOR UPDATE 
USING (public.is_super_admin(auth.uid()));

-- Update the is_super_admin function to be simpler and avoid recursion
CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = _user_id AND role = 'super_admin'::app_role
  )
$function$;