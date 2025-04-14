export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_chat_history: {
        Row: {
          created_at: string
          id: string
          is_embedded: boolean | null
          message_content: string
          message_type: string | null
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_embedded?: boolean | null
          message_content: string
          message_type?: string | null
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_embedded?: boolean | null
          message_content?: string
          message_type?: string | null
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_conversation_embeddings: {
        Row: {
          created_at: string
          embedding: string | null
          id: string
          message_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          embedding?: string | null
          id?: string
          message_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          embedding?: string | null
          id?: string
          message_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_conversation_embeddings_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "ai_chat_history"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_conversation_memories: {
        Row: {
          conversation_summary: string
          created_at: string | null
          embedding: string | null
          id: string
          last_updated: string | null
          user_id: string
        }
        Insert: {
          conversation_summary: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          last_updated?: string | null
          user_id: string
        }
        Update: {
          conversation_summary?: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          last_updated?: string | null
          user_id?: string
        }
        Relationships: []
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
        Relationships: []
      }
      contact_notifications: {
        Row: {
          alert_type: string
          contact_id: string
          delivered: boolean | null
          error_message: string | null
          id: string
          message: string
          sent_at: string
        }
        Insert: {
          alert_type: string
          contact_id: string
          delivered?: boolean | null
          error_message?: string | null
          id?: string
          message: string
          sent_at?: string
        }
        Update: {
          alert_type?: string
          contact_id?: string
          delivered?: boolean | null
          error_message?: string | null
          id?: string
          message?: string
          sent_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_notifications_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "safety_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      date_plans: {
        Row: {
          contact_id: string | null
          created_at: string
          date_time: string
          id: string
          location: string
          location_sharing_enabled: boolean | null
          notes: string | null
          user_id: string
        }
        Insert: {
          contact_id?: string | null
          created_at?: string
          date_time: string
          id?: string
          location: string
          location_sharing_enabled?: boolean | null
          notes?: string | null
          user_id: string
        }
        Update: {
          contact_id?: string | null
          created_at?: string
          date_time?: string
          id?: string
          location?: string
          location_sharing_enabled?: boolean | null
          notes?: string | null
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
        ]
      }
      email_verification: {
        Row: {
          code: string
          created_at: string
          email: string
          expires_at: string
          id: string
          used: boolean | null
        }
        Insert: {
          code: string
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          used?: boolean | null
        }
        Update: {
          code?: string
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          used?: boolean | null
        }
        Relationships: []
      }
      emergency_alerts: {
        Row: {
          id: string
          location_latitude: number | null
          location_link: string | null
          location_longitude: number | null
          timestamp: string
          user_id: string
        }
        Insert: {
          id?: string
          location_latitude?: number | null
          location_link?: string | null
          location_longitude?: number | null
          timestamp?: string
          user_id: string
        }
        Update: {
          id?: string
          location_latitude?: number | null
          location_link?: string | null
          location_longitude?: number | null
          timestamp?: string
          user_id?: string
        }
        Relationships: []
      }
      interests: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      likes: {
        Row: {
          created_at: string
          id: string
          is_like: boolean | null
          is_super: boolean | null
          liked_id: string
          liker_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_like?: boolean | null
          is_super?: boolean | null
          liked_id: string
          liker_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_like?: boolean | null
          is_super?: boolean | null
          liked_id?: string
          liker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_liked_id_fkey"
            columns: ["liked_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_liker_id_fkey"
            columns: ["liker_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          id: string
          matched_at: string
          user1_id: string
          user2_id: string
        }
        Insert: {
          id?: string
          matched_at?: string
          user1_id: string
          user2_id: string
        }
        Update: {
          id?: string
          matched_at?: string
          user1_id?: string
          user2_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "matches_user1_id_fkey"
            columns: ["user1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_user2_id_fkey"
            columns: ["user2_id"]
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
          id: string
          match_id: string
          media_url: string | null
          read: boolean | null
          sender_id: string
          sent_at: string
        }
        Insert: {
          content: string
          content_type?: string | null
          id?: string
          match_id: string
          media_url?: string | null
          read?: boolean | null
          sender_id: string
          sent_at?: string
        }
        Update: {
          content?: string
          content_type?: string | null
          id?: string
          match_id?: string
          media_url?: string | null
          read?: boolean | null
          sender_id?: string
          sent_at?: string
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
      notifications: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean | null
          related_entity_id: string | null
          related_user_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          related_entity_id?: string | null
          related_user_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          related_entity_id?: string | null
          related_user_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_related_user_id_fkey"
            columns: ["related_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
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
          position: number
          profile_id: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_visible?: boolean | null
          position: number
          profile_id: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          is_visible?: boolean | null
          position?: number
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
      profile_interests: {
        Row: {
          interest_id: string
          profile_id: string
        }
        Insert: {
          interest_id: string
          profile_id: string
        }
        Update: {
          interest_id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_interests_interest_id_fkey"
            columns: ["interest_id"]
            isOneToOne: false
            referencedRelation: "interests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_interests_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          age: number | null
          bio: string | null
          created_at: string
          dob: string | null
          email: string | null
          email_verified: boolean | null
          gender: string | null
          gender_preference: string | null
          id: string
          latitude: number | null
          location: string | null
          longitude: number | null
          name: string | null
          relationship_goal: string | null
          show_age: boolean | null
          updated_at: string
          verified: boolean | null
        }
        Insert: {
          age?: number | null
          bio?: string | null
          created_at?: string
          dob?: string | null
          email?: string | null
          email_verified?: boolean | null
          gender?: string | null
          gender_preference?: string | null
          id: string
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          name?: string | null
          relationship_goal?: string | null
          show_age?: boolean | null
          updated_at?: string
          verified?: boolean | null
        }
        Update: {
          age?: number | null
          bio?: string | null
          created_at?: string
          dob?: string | null
          email?: string | null
          email_verified?: boolean | null
          gender?: string | null
          gender_preference?: string | null
          id?: string
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          name?: string | null
          relationship_goal?: string | null
          show_age?: boolean | null
          updated_at?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      safety_contacts: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string
          phone_number: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone_number: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone_number?: string
          user_id?: string
        }
        Relationships: []
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
          comments_count: number
          content: string
          created_at: string
          id: string
          likes_count: number
          streak_count: number
          user_id: string
        }
        Insert: {
          caption?: string | null
          comments_count?: number
          content: string
          created_at?: string
          id?: string
          likes_count?: number
          streak_count?: number
          user_id: string
        }
        Update: {
          caption?: string | null
          comments_count?: number
          content?: string
          created_at?: string
          id?: string
          likes_count?: number
          streak_count?: number
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
      user_settings: {
        Row: {
          account_settings: Json | null
          app_customization: Json | null
          communication_settings: Json | null
          created_at: string
          id: string
          match_preferences: Json | null
          privacy_settings: Json | null
          security_settings: Json | null
          updated_at: string
        }
        Insert: {
          account_settings?: Json | null
          app_customization?: Json | null
          communication_settings?: Json | null
          created_at?: string
          id: string
          match_preferences?: Json | null
          privacy_settings?: Json | null
          security_settings?: Json | null
          updated_at?: string
        }
        Update: {
          account_settings?: Json | null
          app_customization?: Json | null
          communication_settings?: Json | null
          created_at?: string
          id?: string
          match_preferences?: Json | null
          privacy_settings?: Json | null
          security_settings?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_id_fkey"
            columns: ["id"]
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
      calculate_distance: {
        Args: { lat1: number; lon1: number; lat2: number; lon2: number }
        Returns: number
      }
      check_for_match: {
        Args: { liker: string; liked: string }
        Returns: boolean
      }
      find_similar_conversations: {
        Args: {
          query_embedding: string
          match_threshold: number
          match_count: number
        }
        Returns: {
          id: string
          conversation_summary: string
          similarity: number
        }[]
      }
      find_users_within_distance: {
        Args: { user_id: string; max_distance: number }
        Returns: {
          profile_id: string
          name: string
          age: number
          distance: number
        }[]
      }
      get_user_streak_activity: {
        Args: { user_id: string }
        Returns: {
          streak_content: string
          streak_count: number
          likes_count: number
          created_at: string
          interests: string[]
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
