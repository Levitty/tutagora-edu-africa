-- Create bookings table for tutor session bookings
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tutor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  hourly_rate DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_method TEXT CHECK (payment_method IN ('pesapal', 'manual')),
  pesapal_tracking_id TEXT,
  pesapal_merchant_reference TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create tutor availability table
CREATE TABLE public.tutor_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday, 6 = Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(tutor_id, day_of_week, start_time, end_time)
);

-- Create payment transactions table for tracking all payments
CREATE TABLE public.payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  pesapal_tracking_id TEXT,
  pesapal_merchant_reference TEXT UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'KES',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  payment_method TEXT,
  transaction_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutor_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- Bookings policies
CREATE POLICY "Students can view their own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Tutors can view their bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = tutor_id);

CREATE POLICY "Students can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their own bookings" ON public.bookings
  FOR UPDATE USING (auth.uid() = student_id);

CREATE POLICY "Tutors can update their bookings" ON public.bookings
  FOR UPDATE USING (auth.uid() = tutor_id);

-- Tutor availability policies
CREATE POLICY "Anyone can view tutor availability" ON public.tutor_availability
  FOR SELECT USING (true);

CREATE POLICY "Tutors can manage their availability" ON public.tutor_availability
  FOR ALL USING (auth.uid() = tutor_id);

-- Payment transactions policies
CREATE POLICY "Users can view their payment transactions" ON public.payment_transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.bookings 
      WHERE bookings.id = payment_transactions.booking_id 
      AND (bookings.student_id = auth.uid() OR bookings.tutor_id = auth.uid())
    )
  );

CREATE POLICY "Allow payment transaction inserts" ON public.payment_transactions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow payment transaction updates" ON public.payment_transactions
  FOR UPDATE USING (true);

-- Super admin policies
CREATE POLICY "Super admins can manage all bookings" ON public.bookings
  FOR ALL USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Super admins can manage all availability" ON public.tutor_availability
  FOR ALL USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Super admins can manage all transactions" ON public.payment_transactions
  FOR ALL USING (public.is_super_admin(auth.uid()));