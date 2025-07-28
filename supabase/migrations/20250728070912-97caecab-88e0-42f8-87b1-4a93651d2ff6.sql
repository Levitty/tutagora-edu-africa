-- Create chat_messages table for student-tutor communication
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for chat messages
CREATE POLICY "Users can view messages from their bookings" 
ON public.chat_messages 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.bookings 
    WHERE bookings.id = chat_messages.booking_id 
    AND (bookings.student_id = auth.uid() OR bookings.tutor_id = auth.uid())
  )
);

CREATE POLICY "Users can send messages to their bookings" 
ON public.chat_messages 
FOR INSERT 
WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM public.bookings 
    WHERE bookings.id = chat_messages.booking_id 
    AND (bookings.student_id = auth.uid() OR bookings.tutor_id = auth.uid())
  )
);

-- Create index for better performance
CREATE INDEX idx_chat_messages_booking_id ON public.chat_messages(booking_id);
CREATE INDEX idx_chat_messages_created_at ON public.chat_messages(created_at);