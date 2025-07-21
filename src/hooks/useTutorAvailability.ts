import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

export interface TutorAvailability {
  id: string;
  tutor_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
  created_at: string;
}

export const useTutorAvailability = (tutorId?: string) => {
  return useQuery({
    queryKey: ['tutor-availability', tutorId],
    queryFn: async () => {
      if (!tutorId) return [];
      
      const { data, error } = await supabase
        .from('tutor_availability')
        .select('*')
        .eq('tutor_id', tutorId)
        .eq('is_available', true)
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true });
      
      if (error) {
        console.error('Error fetching tutor availability:', error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!tutorId,
  });
};

export const useMyAvailability = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['my-availability', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('tutor_availability')
        .select('*')
        .eq('tutor_id', user.id)
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true });
      
      if (error) {
        console.error('Error fetching my availability:', error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!user?.id,
  });
};

export const useCreateAvailability = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (availability: Omit<TutorAvailability, 'id' | 'tutor_id' | 'created_at'>) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('tutor_availability')
        .insert({
          tutor_id: user.id,
          ...availability,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-availability'] });
      toast({
        title: "Success",
        description: "Availability slot added successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add availability",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateAvailability = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<TutorAvailability> }) => {
      const { data, error } = await supabase
        .from('tutor_availability')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-availability'] });
    },
  });
};

export const useDeleteAvailability = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tutor_availability')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-availability'] });
      toast({
        title: "Success",
        description: "Availability slot removed successfully",
      });
    },
  });
};