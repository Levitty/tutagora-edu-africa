import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

export interface Booking {
  id: string;
  student_id: string;
  tutor_id: string;
  subject: string;
  scheduled_at: string;
  duration_minutes: number;
  hourly_rate: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method?: string;
  pesapal_tracking_id?: string;
  pesapal_merchant_reference?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBookingData {
  tutor_id: string;
  subject: string;
  scheduled_at: string;
  duration_minutes: number;
  hourly_rate: number;
  notes?: string;
}

export const useBookings = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['bookings', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          tutor:profiles!bookings_tutor_id_fkey(first_name, last_name, profile_photo_url),
          student:profiles!bookings_student_id_fkey(first_name, last_name, profile_photo_url)
        `)
        .or(`student_id.eq.${user.id},tutor_id.eq.${user.id}`)
        .order('scheduled_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching bookings:', error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!user?.id,
  });
};

export const useCreateBooking = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (bookingData: CreateBookingData) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const total_amount = (bookingData.duration_minutes / 60) * bookingData.hourly_rate;
      
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          student_id: user.id,
          ...bookingData,
          total_amount,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({
        title: "Booking Created",
        description: "Your booking has been created successfully. Proceed with payment to confirm.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create booking",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Booking> }) => {
      const { data, error } = await supabase
        .from('bookings')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

export const usePaystackPayment = () => {
  return useMutation({
    mutationFn: async ({ bookingId, amount, currency = 'NGN' }: { 
      bookingId: string; 
      amount: number; 
      currency?: string; 
    }) => {
      const { data, error } = await supabase.functions.invoke('paystack-payment', {
        body: { bookingId, amount, currency }
      });
      
      if (error) throw error;
      return data;
    },
    onError: (error: any) => {
      toast({
        title: "Payment Error",
        description: error.message || "Failed to initiate payment",
        variant: "destructive",
      });
    },
  });
};

export const useVerifyPaystackPayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (reference: string) => {
      const { data, error } = await supabase.functions.invoke('verify-paystack-payment', {
        body: { reference }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

// Keep the old Pesapal hooks for backward compatibility
export const usePesapalPayment = usePaystackPayment;
export const useVerifyPayment = useVerifyPaystackPayment;
