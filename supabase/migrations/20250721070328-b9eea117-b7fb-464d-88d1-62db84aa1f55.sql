-- Fix role assignment and ensure proper defaults
-- Update any NULL roles to 'student'
UPDATE public.profiles 
SET role = 'student'::app_role 
WHERE role IS NULL;

-- Make sure the role column has a proper default
ALTER TABLE public.profiles 
ALTER COLUMN role SET DEFAULT 'student'::app_role;

-- Update trigger to ensure proper role assignment
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    user_role text;
BEGIN
    -- Determine the role based on user_type
    user_role := COALESCE(NEW.raw_user_meta_data ->> 'user_type', 'student');
    
    -- Insert the profile with explicit role casting
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
        user_role,
        NEW.raw_user_meta_data ->> 'phone',
        NEW.raw_user_meta_data ->> 'country',
        CASE 
            WHEN user_role = 'tutor' THEN 'tutor'::app_role
            WHEN user_role = 'admin' OR user_role = 'super_admin' THEN 'super_admin'::app_role
            ELSE 'student'::app_role
        END
    ) ON CONFLICT (id) DO UPDATE SET
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        user_type = EXCLUDED.user_type,
        phone = EXCLUDED.phone,
        country = EXCLUDED.country,
        role = EXCLUDED.role;
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log the error but don't block user creation
        RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
        RETURN NEW;
END;
$function$;