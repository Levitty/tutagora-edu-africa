
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from './useAuth'

export const useCourses = () => {
  return useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    },
  })
}

export const useTutorCourses = () => {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['tutor-courses', user?.id],
    queryFn: async () => {
      if (!user?.id) return []
      
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('tutor_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    },
    enabled: !!user?.id,
  })
}

export const useCreateCourse = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  
  return useMutation({
    mutationFn: async (courseData: any) => {
      if (!user?.id) throw new Error('Not authenticated')
      
      const { data, error } = await supabase
        .from('courses')
        .insert({
          ...courseData,
          tutor_id: user.id,
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutor-courses'] })
    },
  })
}
