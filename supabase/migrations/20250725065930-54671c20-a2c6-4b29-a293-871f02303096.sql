-- Fix the RLS policy issue and continue with security fixes
-- 1. Secure the handle_new_user function
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

-- 2. Create RLS policies for user_roles
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles" ON public.user_roles
FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Super admins can manage all roles" ON public.user_roles;
CREATE POLICY "Super admins can manage all roles" ON public.user_roles
FOR ALL USING (is_super_admin(auth.uid()));

-- 3. Fix the profiles update policy 
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

-- 4. File Storage Security - Make KYC bucket private
UPDATE storage.buckets 
SET public = false 
WHERE id = 'kyc-documents';