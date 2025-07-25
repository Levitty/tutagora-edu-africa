
import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from './useAuth'

// File validation constants
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_FILE_TYPES = {
  'kyc-documents': ['image/jpeg', 'image/png', 'application/pdf'],
  'profile-photos': ['image/jpeg', 'image/png', 'image/webp'],
  'course-materials': ['image/jpeg', 'image/png', 'application/pdf', 'video/mp4', 'video/webm']
}

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false)
  const { user } = useAuth()

  const validateFile = (file: File, bucket: string) => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`)
    }

    // Check file type
    const allowedTypes = ALLOWED_FILE_TYPES[bucket as keyof typeof ALLOWED_FILE_TYPES]
    if (allowedTypes && !allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} is not allowed for ${bucket}`)
    }

    // Additional security checks
    const suspiciousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.com']
    const fileName = file.name.toLowerCase()
    if (suspiciousExtensions.some(ext => fileName.endsWith(ext))) {
      throw new Error('File type not allowed for security reasons')
    }
  }

  const uploadFile = async (file: File, bucket: string, path?: string) => {
    if (!user?.id) throw new Error('Not authenticated')
    
    // Validate file before upload
    validateFile(file, bucket)
    
    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      // Sanitize filename
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const fileName = path || `${user.id}/${Date.now()}_${sanitizedName}`
      
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file)
      
      if (uploadError) throw uploadError
      
      // For private buckets, use signed URL
      if (bucket === 'kyc-documents') {
        const { data, error } = await supabase.storage
          .from(bucket)
          .createSignedUrl(fileName, 3600) // 1 hour expiry
        
        if (error) throw error
        return data.signedUrl
      }
      
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
