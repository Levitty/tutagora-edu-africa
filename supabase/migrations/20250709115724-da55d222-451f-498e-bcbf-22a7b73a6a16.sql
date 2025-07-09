
-- Create an enum for user roles
CREATE TYPE public.app_role AS ENUM ('super_admin', 'tutor', 'student');

-- Add role column to profiles table
ALTER TABLE public.profiles ADD COLUMN role app_role DEFAULT 'student';

-- Create user_roles table for more complex role management if needed in future
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    assigned_by UUID REFERENCES auth.users(id),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = _user_id AND role = _role
  )
$$;

-- Create function to check if user is super admin
CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT public.has_role(_user_id, 'super_admin')
$$;

-- Update profiles RLS policies to include role-based access
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- New RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Super admins can view all profiles" 
ON public.profiles FOR SELECT 
USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Super admins can update any profile" 
ON public.profiles FOR UPDATE 
USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- RLS policies for user_roles table
CREATE POLICY "Super admins can manage all roles" 
ON public.user_roles FOR ALL 
USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Users can view their own roles" 
ON public.user_roles FOR SELECT 
USING (auth.uid() = user_id);

-- Update the handle_new_user function to handle role assignment
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = ''
AS $$
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
$$;

-- Create analytics table for super admin dashboard
CREATE TABLE public.analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_name TEXT NOT NULL,
    metric_value NUMERIC NOT NULL,
    metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on analytics
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- Only super admins can access analytics
CREATE POLICY "Super admins can manage analytics" 
ON public.analytics FOR ALL 
USING (public.is_super_admin(auth.uid()));

-- Add tutor-specific columns to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS teaching_experience TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS education_background TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS certifications TEXT[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS available_hours JSONB;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS specializations TEXT[];

-- Add student-specific columns to profiles  
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS grade_level TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS learning_goals TEXT[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferred_subjects TEXT[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS study_schedule JSONB;
