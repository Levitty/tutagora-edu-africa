-- Add foreign key relationships between bookings and profiles tables
ALTER TABLE public.bookings 
ADD CONSTRAINT bookings_student_id_fkey 
FOREIGN KEY (student_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.bookings 
ADD CONSTRAINT bookings_tutor_id_fkey 
FOREIGN KEY (tutor_id) REFERENCES public.profiles(id) ON DELETE CASCADE;