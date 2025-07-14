
-- First, let's ensure we're working with a clean state
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Drop the enum if it exists (to recreate it cleanly)
DROP TYPE IF EXISTS public.app_role CASCADE;

-- Create the app_role enum fresh
CREATE TYPE public.app_role AS ENUM ('super_admin', 'tutor', 'student');

-- Ensure the profiles table has the role column with the correct type
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role app_role DEFAULT 'student';

-- Create the handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, user_type, phone, country, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    NEW.raw_user_meta_data ->> 'user_type',
    NEW.raw_user_meta_data ->> 'phone',
    NEW.raw_user_meta_data ->> 'country',
    CASE 
      WHEN NEW.raw_user_meta_data ->> 'user_type' = 'tutor' THEN 'tutor'::app_role
      WHEN NEW.raw_user_meta_data ->> 'user_type' = 'admin' THEN 'super_admin'::app_role
      ELSE 'student'::app_role
    END
  );
  RETURN NEW;
END;
$function$;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
