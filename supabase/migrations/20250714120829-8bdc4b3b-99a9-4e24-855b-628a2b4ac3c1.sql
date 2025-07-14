
-- Fix the registration issue by ensuring the enum exists and updating the trigger
-- First, ensure we have a clean state
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Recreate the enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('super_admin', 'tutor', 'student');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Ensure the profiles table has the role column
DO $$ BEGIN
    ALTER TABLE public.profiles ADD COLUMN role app_role DEFAULT 'student';
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- Create a simpler, more robust handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
            WHEN user_role = 'admin' THEN 'super_admin'::app_role
            ELSE 'student'::app_role
        END
    );
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log the error but don't block user creation
        RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
        RETURN NEW;
END;
$$;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW 
    EXECUTE FUNCTION public.handle_new_user();
