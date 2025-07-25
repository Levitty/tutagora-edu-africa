
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from './useAuth'

export const useRole = () => {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['user-role', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log('No user ID available for role fetch');
        return null;
      }
      
      console.log('Fetching role for user:', user.id);
      console.log('User email:', user.email);
      
      // First try the new user_roles table
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle()
      
      if (!rolesError && rolesData) {
        console.log('User role from user_roles table:', rolesData.role);
        return rolesData.role;
      }
      
      // Fallback to profiles table for existing users
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()
      
      if (error) {
        console.error('Error fetching user role:', error);
        // Return student as fallback
        console.log('Returning student as fallback role');
        return 'student';
      }
      
      console.log('User role data from database:', data);
      const role = data?.role || 'student';
      console.log('Final role being returned:', role);
      return role;
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 3,
  })
}

export const useIsSuperAdmin = () => {
  const { data: role, isLoading } = useRole()
  const isSuperAdmin = !isLoading && role === 'super_admin'
  console.log('useIsSuperAdmin - role:', role, 'isSuperAdmin:', isSuperAdmin, 'isLoading:', isLoading);
  return isSuperAdmin
}

export const useIsTutor = () => {
  const { data: role, isLoading } = useRole()
  const isTutor = !isLoading && role === 'tutor'
  console.log('useIsTutor - role:', role, 'isTutor:', isTutor, 'isLoading:', isLoading);
  return isTutor
}

export const useIsStudent = () => {
  const { data: role, isLoading } = useRole()
  const isStudent = !isLoading && (role === 'student' || (!role && !isLoading))
  console.log('useIsStudent - role:', role, 'isStudent:', isStudent, 'isLoading:', isLoading);
  return isStudent
}
