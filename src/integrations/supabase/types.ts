export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ai_chat_history: {
        Row: {
          created_at: string
          id: string
          message_content: string
          message_type: string | null
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message_content: string
          message_type?: string | null
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message_content?: string
          message_type?: string | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_chat_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      blocked_users: {
        Row: {
          blocked_user_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          blocked_user_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          blocked_user_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blocked_users_blocked_user_id_fkey"
            columns: ["blocked_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blocked_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      date_plans: {
        Row: {
          contact_id: string | null
          created_at: string
          date_time: string | null
          description: string | null
          id: string
          location: string | null
          location_sharing_enabled: boolean | null
          notes: string | null
          partner_name: string | null
          status: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          contact_id?: string | null
          created_at?: string
          date_time?: string | null
          description?: string | null
          id?: string
          location?: string | null
          location_sharing_enabled?: boolean | null
          notes?: string | null
          partner_name?: string | null
          status?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          contact_id?: string | null
          created_at?: string
          date_time?: string | null
          description?: string | null
          id?: string
          location?: string | null
          location_sharing_enabled?: boolean | null
          notes?: string | null
          partner_name?: string | null
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "date_plans_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "safety_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "date_plans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          created_at: string
          id: string
          matched_user_id: string
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          matched_user_id: string
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          matched_user_id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "matches_matched_user_id_fkey"
            columns: ["matched_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          content_type: string | null
          created_at: string
          id: string
          is_read: boolean | null
          match_id: string
          media_url: string | null
          sender_id: string
        }
        Insert: {
          content: string
          content_type?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          match_id: string
          media_url?: string | null
          sender_id: string
        }
        Update: {
          content?: string
          content_type?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          match_id?: string
          media_url?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_images: {
        Row: {
          created_at: string
          id: string
          is_visible: boolean | null
          position: number | null
          profile_id: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_visible?: boolean | null
          position?: number | null
          profile_id: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          is_visible?: boolean | null
          position?: number | null
          profile_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_images_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_onboarding: {
        Row: {
          completed: boolean | null
          created_at: string
          current_step: string | null
          id: string
          profile_id: string
          updated_at: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string
          current_step?: string | null
          id?: string
          profile_id: string
          updated_at?: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string
          current_step?: string | null
          id?: string
          profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_onboarding_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          age: number | null
          age_range_max: number | null
          age_range_min: number | null
          avatar_url: string | null
          bio: string | null
          city: string | null
          communication_style: string | null
          country: string | null
          created_at: string
          display_name: string | null
          distance_preference: number | null
          dob: string | null
          drinking_habit: string | null
          education: string | null
          email: string | null
          email_verified: boolean | null
          exercise: string | null
          gender: string | null
          gender_preference: string | null
          height_cm: number | null
          hometown: string | null
          id: string
          interests: string[] | null
          location: string | null
          love_language: string | null
          name: string | null
          occupation: string | null
          onboarding_completed: boolean | null
          pronouns: string | null
          relationship_goal: string | null
          show_age: boolean | null
          show_me_verified_only: boolean | null
          smoking_habit: string | null
          streak_count: number | null
          updated_at: string
          verified: boolean | null
          zodiac_sign: string | null
        }
        Insert: {
          age?: number | null
          age_range_max?: number | null
          age_range_min?: number | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          communication_style?: string | null
          country?: string | null
          created_at?: string
          display_name?: string | null
          distance_preference?: number | null
          dob?: string | null
          drinking_habit?: string | null
          education?: string | null
          email?: string | null
          email_verified?: boolean | null
          exercise?: string | null
          gender?: string | null
          gender_preference?: string | null
          height_cm?: number | null
          hometown?: string | null
          id: string
          interests?: string[] | null
          location?: string | null
          love_language?: string | null
          name?: string | null
          occupation?: string | null
          onboarding_completed?: boolean | null
          pronouns?: string | null
          relationship_goal?: string | null
          show_age?: boolean | null
          show_me_verified_only?: boolean | null
          smoking_habit?: string | null
          streak_count?: number | null
          updated_at?: string
          verified?: boolean | null
          zodiac_sign?: string | null
        }
        Update: {
          age?: number | null
          age_range_max?: number | null
          age_range_min?: number | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          communication_style?: string | null
          country?: string | null
          created_at?: string
          display_name?: string | null
          distance_preference?: number | null
          dob?: string | null
          drinking_habit?: string | null
          education?: string | null
          email?: string | null
          email_verified?: boolean | null
          exercise?: string | null
          gender?: string | null
          gender_preference?: string | null
          height_cm?: number | null
          hometown?: string | null
          id?: string
          interests?: string[] | null
          location?: string | null
          love_language?: string | null
          name?: string | null
          occupation?: string | null
          onboarding_completed?: boolean | null
          pronouns?: string | null
          relationship_goal?: string | null
          show_age?: boolean | null
          show_me_verified_only?: boolean | null
          smoking_habit?: string | null
          streak_count?: number | null
          updated_at?: string
          verified?: boolean | null
          zodiac_sign?: string | null
        }
        Relationships: []
      }
      safety_contacts: {
        Row: {
          contact_email: string | null
          contact_name: string
          contact_phone: string | null
          created_at: string
          id: string
          is_primary: boolean | null
          name: string | null
          phone_number: string | null
          user_id: string
        }
        Insert: {
          contact_email?: string | null
          contact_name: string
          contact_phone?: string | null
          created_at?: string
          id?: string
          is_primary?: boolean | null
          name?: string | null
          phone_number?: string | null
          user_id: string
        }
        Update: {
          contact_email?: string | null
          contact_name?: string
          contact_phone?: string | null
          created_at?: string
          id?: string
          is_primary?: boolean | null
          name?: string | null
          phone_number?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "safety_contacts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      streak_likes: {
        Row: {
          created_at: string
          id: string
          streak_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          streak_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          streak_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "streak_likes_streak_id_fkey"
            columns: ["streak_id"]
            isOneToOne: false
            referencedRelation: "streaks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "streak_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      streaks: {
        Row: {
          caption: string | null
          comments_count: number | null
          content: string
          created_at: string
          expires_at: string | null
          id: string
          likes_count: number | null
          streak_count: number | null
          user_id: string
        }
        Insert: {
          caption?: string | null
          comments_count?: number | null
          content: string
          created_at?: string
          expires_at?: string | null
          id?: string
          likes_count?: number | null
          streak_count?: number | null
          user_id: string
        }
        Update: {
          caption?: string | null
          comments_count?: number | null
          content?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          likes_count?: number | null
          streak_count?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "streaks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      swipes: {
        Row: {
          created_at: string
          direction: string
          id: string
          swiped_user_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          direction: string
          id?: string
          swiped_user_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          direction?: string
          id?: string
          swiped_user_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "swipes_swiped_user_id_fkey"
            columns: ["swiped_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "swipes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_feedback: {
        Row: {
          created_at: string
          feedback_content: string
          feedback_type: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          feedback_content: string
          feedback_type: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          feedback_content?: string
          feedback_type?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          created_at: string
          id: string
          location_sharing: boolean | null
          notifications_enabled: boolean | null
          show_online_status: boolean | null
          theme: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          location_sharing?: boolean | null
          notifications_enabled?: boolean | null
          show_online_status?: boolean | null
          theme?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          location_sharing?: boolean | null
          notifications_enabled?: boolean | null
          show_online_status?: boolean | null
          theme?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
