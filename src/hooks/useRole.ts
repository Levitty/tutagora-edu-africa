
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from './useAuth'

export const useRole = () => {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['user-role', user?.id],
    queryFn: async () => {
      if (!user?.id) return null
      
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      
      if (error) throw error
      return data?.role || 'student'
    },
    enabled: !!user?.id,
  })
}

export const useIsSuperAdmin = () => {
  const { data: role } = useRole()
  return role === 'super_admin'
}

export const useIsTutor = () => {
  const { data: role } = useRole()
  return role === 'tutor'
}

export const useIsStudent = () => {
  const { data: role } = useRole()
  return role === 'student'
}

export const useIsInstitution = () => {
  const { data: role } = useRole()
  return role === 'institution'
}
