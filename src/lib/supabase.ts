
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rpskgapsanraehehxfdv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwc2tnYXBzYW5yYWVoZWh4ZmR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0NDc3NDcsImV4cCI6MjA2NzAyMzc0N30.9TsuyUcbTCD8EAHVr8-bryOisTMjQ1OFrv3QyS8Rkvg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface Course {
  id: string
  title: string
  description: string
  subject: string
  level: string
  price: number
  tutor_id: string
  thumbnail_url?: string
  video_url?: string
  duration_minutes: number
  language: string
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  user_type: 'student' | 'tutor' | 'admin' | 'parent'
  phone?: string
  country?: string
  created_at: string
  updated_at: string
}

export interface Enrollment {
  id: string
  student_id: string
  course_id: string
  progress: number
  completed_at?: string
  created_at: string
}

export interface LiveSession {
  id: string
  course_id: string
  tutor_id: string
  title: string
  scheduled_at: string
  duration_minutes: number
  meeting_url?: string
  status: 'scheduled' | 'live' | 'completed' | 'cancelled'
  created_at: string
}
