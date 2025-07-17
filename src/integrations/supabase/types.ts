export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_actions: {
        Row: {
          action_type: string
          admin_id: string
          created_at: string | null
          id: string
          notes: string | null
          target_id: string
          target_type: string
        }
        Insert: {
          action_type: string
          admin_id: string
          created_at?: string | null
          id?: string
          notes?: string | null
          target_id: string
          target_type: string
        }
        Update: {
          action_type?: string
          admin_id?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          target_id?: string
          target_type?: string
        }
        Relationships: []
      }
      ai_learning_sessions: {
        Row: {
          completed_at: string | null
          created_at: string
          difficulty_level: string | null
          id: string
          score: number | null
          session_data: Json | null
          student_id: string
          subject: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          difficulty_level?: string | null
          id?: string
          score?: number | null
          session_data?: Json | null
          student_id: string
          subject: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          difficulty_level?: string | null
          id?: string
          score?: number | null
          session_data?: Json | null
          student_id?: string
          subject?: string
        }
        Relationships: []
      }
      analytics: {
        Row: {
          created_at: string | null
          id: string
          metric_date: string
          metric_name: string
          metric_value: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          metric_date?: string
          metric_name: string
          metric_value: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          metric_date?: string
          metric_name?: string
          metric_value?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      course_videos: {
        Row: {
          course_id: string
          created_at: string | null
          description: string | null
          duration_seconds: number | null
          id: string
          is_published: boolean | null
          order_index: number | null
          thumbnail_url: string | null
          title: string
          tutor_id: string
          updated_at: string | null
          video_url: string
        }
        Insert: {
          course_id: string
          created_at?: string | null
          description?: string | null
          duration_seconds?: number | null
          id?: string
          is_published?: boolean | null
          order_index?: number | null
          thumbnail_url?: string | null
          title: string
          tutor_id: string
          updated_at?: string | null
          video_url: string
        }
        Update: {
          course_id?: string
          created_at?: string | null
          description?: string | null
          duration_seconds?: number | null
          id?: string
          is_published?: boolean | null
          order_index?: number | null
          thumbnail_url?: string | null
          title?: string
          tutor_id?: string
          updated_at?: string | null
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_videos_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          created_at: string
          description: string | null
          duration_weeks: number | null
          id: string
          is_published: boolean | null
          level: string | null
          price: number | null
          subject: string
          thumbnail_url: string | null
          title: string
          tutor_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_weeks?: number | null
          id?: string
          is_published?: boolean | null
          level?: string | null
          price?: number | null
          subject: string
          thumbnail_url?: string | null
          title: string
          tutor_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_weeks?: number | null
          id?: string
          is_published?: boolean | null
          level?: string | null
          price?: number | null
          subject?: string
          thumbnail_url?: string | null
          title?: string
          tutor_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          completed_at: string | null
          course_id: string
          enrolled_at: string
          id: string
          progress: number | null
          student_id: string
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          enrolled_at?: string
          id?: string
          progress?: number | null
          student_id: string
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          enrolled_at?: string
          id?: string
          progress?: number | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      kyc_documents: {
        Row: {
          academic_qualification_type: string | null
          document_type: string
          document_url: string
          id: string
          notes: string | null
          reviewed_at: string | null
          status: string | null
          submitted_at: string
          tutor_id: string
        }
        Insert: {
          academic_qualification_type?: string | null
          document_type: string
          document_url: string
          id?: string
          notes?: string | null
          reviewed_at?: string | null
          status?: string | null
          submitted_at?: string
          tutor_id: string
        }
        Update: {
          academic_qualification_type?: string | null
          document_type?: string
          document_url?: string
          id?: string
          notes?: string | null
          reviewed_at?: string | null
          status?: string | null
          submitted_at?: string
          tutor_id?: string
        }
        Relationships: []
      }
      lessons: {
        Row: {
          content: string | null
          course_id: string
          created_at: string
          duration_minutes: number | null
          id: string
          order_index: number
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          content?: string | null
          course_id: string
          created_at?: string
          duration_minutes?: number | null
          id?: string
          order_index: number
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          content?: string | null
          course_id?: string
          created_at?: string
          duration_minutes?: number | null
          id?: string
          order_index?: number
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      live_sessions: {
        Row: {
          bbb_attendee_password: string | null
          bbb_meeting_id: string | null
          bbb_moderator_password: string | null
          course_id: string | null
          created_at: string
          duration_minutes: number | null
          id: string
          scheduled_at: string
          status: string | null
          title: string
          tutor_id: string
        }
        Insert: {
          bbb_attendee_password?: string | null
          bbb_meeting_id?: string | null
          bbb_moderator_password?: string | null
          course_id?: string | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          scheduled_at: string
          status?: string | null
          title: string
          tutor_id: string
        }
        Update: {
          bbb_attendee_password?: string | null
          bbb_meeting_id?: string | null
          bbb_moderator_password?: string | null
          course_id?: string | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          scheduled_at?: string
          status?: string | null
          title?: string
          tutor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "live_sessions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          available_hours: Json | null
          bio: string | null
          certifications: string[] | null
          country: string | null
          created_at: string
          education_background: string | null
          expertise: string[] | null
          first_name: string | null
          grade_level: string | null
          hourly_rate: number | null
          id: string
          kyc_status: string | null
          last_name: string | null
          learning_goals: string[] | null
          phone: string | null
          preferred_subjects: string[] | null
          profile_photo_url: string | null
          role: Database["public"]["Enums"]["app_role"] | null
          specializations: string[] | null
          study_schedule: Json | null
          teaching_experience: string | null
          updated_at: string
          user_type: string | null
        }
        Insert: {
          available_hours?: Json | null
          bio?: string | null
          certifications?: string[] | null
          country?: string | null
          created_at?: string
          education_background?: string | null
          expertise?: string[] | null
          first_name?: string | null
          grade_level?: string | null
          hourly_rate?: number | null
          id: string
          kyc_status?: string | null
          last_name?: string | null
          learning_goals?: string[] | null
          phone?: string | null
          preferred_subjects?: string[] | null
          profile_photo_url?: string | null
          role?: Database["public"]["Enums"]["app_role"] | null
          specializations?: string[] | null
          study_schedule?: Json | null
          teaching_experience?: string | null
          updated_at?: string
          user_type?: string | null
        }
        Update: {
          available_hours?: Json | null
          bio?: string | null
          certifications?: string[] | null
          country?: string | null
          created_at?: string
          education_background?: string | null
          expertise?: string[] | null
          first_name?: string | null
          grade_level?: string | null
          hourly_rate?: number | null
          id?: string
          kyc_status?: string | null
          last_name?: string | null
          learning_goals?: string[] | null
          phone?: string | null
          preferred_subjects?: string[] | null
          profile_photo_url?: string | null
          role?: Database["public"]["Enums"]["app_role"] | null
          specializations?: string[] | null
          study_schedule?: Json | null
          teaching_experience?: string | null
          updated_at?: string
          user_type?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      is_super_admin: {
        Args: { _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "super_admin" | "tutor" | "student"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["super_admin", "tutor", "student"],
    },
  },
} as const
