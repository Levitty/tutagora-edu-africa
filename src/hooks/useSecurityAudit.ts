import { useMutation, useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from './useAuth'

export const useSecurityAudit = () => {
  const { user } = useAuth()

  const logSecurityEvent = useMutation({
    mutationFn: async ({ 
      eventType, 
      eventData 
    }: { 
      eventType: string
      eventData?: any 
    }) => {
      if (!user?.id) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('security_audit')
        .insert({
          user_id: user.id,
          event_type: eventType,
          event_data: eventData,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error
      return data
    }
  })

  const getAuditLogs = useQuery({
    queryKey: ['security-audit', user?.id],
    queryFn: async () => {
      if (!user?.id) return []

      const { data, error } = await supabase
        .from('security_audit')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)

      if (error) throw error
      return data || []
    },
    enabled: !!user?.id
  })

  return {
    logSecurityEvent: logSecurityEvent.mutate,
    auditLogs: getAuditLogs.data,
    isLoading: getAuditLogs.isLoading
  }
}