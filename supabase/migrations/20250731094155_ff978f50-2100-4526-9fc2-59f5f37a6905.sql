-- Create live_sessions table for BigBlueButton integration
CREATE TABLE public.live_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  meeting_id TEXT NOT NULL UNIQUE,
  bbb_response TEXT,
  status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'active', 'ended')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.live_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for live_sessions
CREATE POLICY "Users can view sessions for their bookings" 
ON public.live_sessions 
FOR SELECT 
USING (
  booking_id IN (
    SELECT id FROM public.bookings 
    WHERE student_id = auth.uid() OR tutor_id = auth.uid()
  )
);

CREATE POLICY "Users can create sessions for their bookings" 
ON public.live_sessions 
FOR INSERT 
WITH CHECK (
  booking_id IN (
    SELECT id FROM public.bookings 
    WHERE student_id = auth.uid() OR tutor_id = auth.uid()
  )
);

CREATE POLICY "Users can update sessions for their bookings" 
ON public.live_sessions 
FOR UPDATE 
USING (
  booking_id IN (
    SELECT id FROM public.bookings 
    WHERE student_id = auth.uid() OR tutor_id = auth.uid()
  )
);

-- Create trigger for updating timestamps
CREATE TRIGGER update_live_sessions_updated_at
BEFORE UPDATE ON public.live_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_live_sessions_booking_id ON public.live_sessions(booking_id);
CREATE INDEX idx_live_sessions_meeting_id ON public.live_sessions(meeting_id);