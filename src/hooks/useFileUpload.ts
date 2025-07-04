
import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from './useAuth'

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false)
  const { user } = useAuth()

  const uploadFile = async (file: File, bucket: string, path?: string) => {
    if (!user?.id) throw new Error('Not authenticated')
    
    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = path || `${user.id}/${Date.now()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file)
      
      if (uploadError) throw uploadError
      
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName)
      
      return data.publicUrl
    } finally {
      setUploading(false)
    }
  }

  return { uploadFile, uploading }
}
