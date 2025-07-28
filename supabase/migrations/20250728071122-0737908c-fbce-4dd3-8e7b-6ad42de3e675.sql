-- Create chat_messages table for tutor-student communication
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL,
  sender_id UUID NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for chat access
CREATE POLICY "Users can view messages for their bookings" 
ON public.chat_messages 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM bookings 
    WHERE bookings.id = chat_messages.booking_id 
    AND (bookings.student_id = auth.uid() OR bookings.tutor_id = auth.uid())
  )
);

CREATE POLICY "Users can send messages for their bookings" 
ON public.chat_messages 
FOR INSERT 
WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM bookings 
    WHERE bookings.id = chat_messages.booking_id 
    AND (bookings.student_id = auth.uid() OR bookings.tutor_id = auth.uid())
  )
);

-- Enable realtime for chat messages
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;