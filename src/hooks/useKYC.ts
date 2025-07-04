
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from './useAuth'

export const useKYCDocuments = () => {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['kyc-documents', user?.id],
    queryFn: async () => {
      if (!user?.id) return []
      
      const { data, error } = await supabase
        .from('kyc_documents')
        .select('*')
        .eq('tutor_id', user.id)
        .order('submitted_at', { ascending: false })

      if (error) throw error
      return data || []
    },
    enabled: !!user?.id,
  })
}

export const useUploadKYCDocument = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  
  return useMutation({
    mutationFn: async ({ file, documentType }: { file: File; documentType: string }) => {
      if (!user?.id) throw new Error('Not authenticated')
      
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${documentType}_${Date.now()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('kyc-documents')
        .upload(fileName, file)
      
      if (uploadError) throw uploadError
      
      const { data: urlData } = supabase.storage
        .from('kyc-documents')
        .getPublicUrl(fileName)
      
      const { data, error } = await supabase
        .from('kyc_documents')
        .insert({
          tutor_id: user.id,
          document_type: documentType,
          document_url: urlData.publicUrl,
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kyc-documents'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}
