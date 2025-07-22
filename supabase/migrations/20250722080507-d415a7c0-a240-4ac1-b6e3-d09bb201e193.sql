
-- Allow anyone to view tutor profiles (users with role 'tutor')
CREATE POLICY "Anyone can view tutor profiles" 
ON public.profiles FOR SELECT 
USING (role = 'tutor'::app_role);

-- Allow anyone to view profiles of users who have approved KYC status (for verified tutors)
CREATE POLICY "Anyone can view approved tutor profiles" 
ON public.profiles FOR SELECT 
USING (role = 'tutor'::app_role AND kyc_status = 'approved');
