
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from './useAuth'

export const useRole = () => {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['user-role', user?.id],
    queryFn: async () => {
      if (!user?.id) return null
      
      console.log('Fetching role for user:', user.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      
      if (error) {
        console.error('Error fetching user role:', error);
        throw error;
      }
      
      console.log('User role data:', data);
      return data?.role || 'student'
    },
    enabled: !!user?.id,
  })
}

export const useIsSuperAdmin = () => {
  const { data: role } = useRole()
  const isSuperAdmin = role === 'super_admin'
  console.log('useIsSuperAdmin - role:', role, 'isSuperAdmin:', isSuperAdmin);
  return isSuperAdmin
}

export const useIsTutor = () => {
  const { data: role } = useRole()
  const isTutor = role === 'tutor'
  console.log('useIsTutor - role:', role, 'isTutor:', isTutor);
  return isTutor
}

export const useIsStudent = () => {
  const { data: role } = useRole()
  const isStudent = role === 'student'
  console.log('useIsStudent - role:', role, 'isStudent:', isStudent);
  return isStudent
}
