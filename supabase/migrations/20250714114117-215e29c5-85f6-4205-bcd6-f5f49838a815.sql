
-- First, let's ensure the app_role enum exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE public.app_role AS ENUM ('super_admin', 'tutor', 'student', 'institution');
    ELSE
        -- Add 'institution' to existing enum if it doesn't exist
        BEGIN
            ALTER TYPE public.app_role ADD VALUE 'institution';
        EXCEPTION 
            WHEN duplicate_object THEN NULL;
        END;
    END IF;
END $$;

-- Update profiles table to ensure role column exists with proper default
DO $$
BEGIN
    -- Add role column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'role') THEN
        ALTER TABLE public.profiles ADD COLUMN role app_role DEFAULT 'student';
    END IF;
    
    -- Add institution-specific fields if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'institution_name') THEN
        ALTER TABLE public.profiles ADD COLUMN institution_name text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'accreditation_status') THEN
        ALTER TABLE public.profiles ADD COLUMN accreditation_status text DEFAULT 'pending';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'institution_type') THEN
        ALTER TABLE public.profiles ADD COLUMN institution_type text;
    END IF;
END $$;

-- Update the handle_new_user function to properly handle all user types
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  INSERT INTO public.profiles (
    id, 
    first_name, 
    last_name, 
    user_type, 
    phone, 
    country, 
    role,
    institution_name,
    institution_type
  )
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
      WHEN NEW.raw_user_meta_data ->> 'user_type' = 'institution' THEN 'institution'::app_role
      ELSE 'student'::app_role
    END,
    NEW.raw_user_meta_data ->> 'institution_name',
    NEW.raw_user_meta_data ->> 'institution_type'
  );
  RETURN NEW;
END;
$function$;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add RLS policy for institutions
CREATE POLICY "Institutions can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id OR public.has_role(auth.uid(), 'institution'));

-- Update the has_role function to handle institutions
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

-- Add function to check if user is institution
CREATE OR REPLACE FUNCTION public.is_institution(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT public.has_role(_user_id, 'institution')
$$;
