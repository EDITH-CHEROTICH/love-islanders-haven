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
          delivered: boolean
          error_message: string | null
          id: string
          message: string
          sent_at: string
        }
        Insert: {
          alert_type: string
          contact_id: string
          delivered?: boolean
          error_message?: string | null
          id?: string
          message: string
          sent_at?: string
        }
        Update: {
          alert_type?: string
          contact_id?: string
          delivered?: boolean
          error_message?: string | null
          id?: string
          message?: string
          sent_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_contact_id"
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
          location_sharing_enabled: boolean
          notes: string | null
          user_id: string
        }
        Insert: {
          contact_id?: string | null
          created_at?: string
          date_time: string
          id?: string
          location: string
          location_sharing_enabled?: boolean
          notes?: string | null
          user_id: string
        }
        Update: {
          contact_id?: string | null
          created_at?: string
          date_time?: string
          id?: string
          location?: string
          location_sharing_enabled?: boolean
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
          liked_id: string | null
          liker_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          liked_id?: string | null
          liker_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          liked_id?: string | null
          liker_id?: string | null
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
          user1_id: string | null
          user2_id: string | null
        }
        Insert: {
          id?: string
          matched_at?: string
          user1_id?: string | null
          user2_id?: string | null
        }
        Update: {
          id?: string
          matched_at?: string
          user1_id?: string | null
          user2_id?: string | null
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
          match_id: string | null
          media_url: string | null
          read: boolean | null
          sender_id: string | null
          sent_at: string
        }
        Insert: {
          content: string
          content_type?: string | null
          id?: string
          match_id?: string | null
          media_url?: string | null
          read?: boolean | null
          sender_id?: string | null
          sent_at?: string
        }
        Update: {
          content?: string
          content_type?: string | null
          id?: string
          match_id?: string | null
          media_url?: string | null
          read?: boolean | null
          sender_id?: string | null
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
          is_read: boolean
          related_entity_id: string | null
          related_user_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean
          related_entity_id?: string | null
          related_user_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean
          related_entity_id?: string | null
          related_user_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profile_images: {
        Row: {
          created_at: string
          id: string
          position: number
          profile_id: string | null
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          position: number
          profile_id?: string | null
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          position?: number
          profile_id?: string | null
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
      profile_videos: {
        Row: {
          created_at: string
          id: string
          profile_id: string | null
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          profile_id?: string | null
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          profile_id?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_videos_profile_id_fkey"
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
          children_count: number | null
          created_at: string
          dob: string | null
          education: string | null
          email_verified: boolean | null
          gender: string | null
          gender_preference: string | null
          has_children: boolean | null
          has_pets: boolean | null
          height: number | null
          height_cm: number | null
          height_unit: string | null
          id: string
          latitude: number | null
          location: string | null
          location_updated_at: string | null
          longitude: number | null
          name: string
          occupation: string | null
          pet_type: string | null
          relationship_goal: string | null
          show_age: boolean | null
          streak_count: number | null
          updated_at: string
          verified: boolean | null
        }
        Insert: {
          age?: number | null
          bio?: string | null
          children_count?: number | null
          created_at?: string
          dob?: string | null
          education?: string | null
          email_verified?: boolean | null
          gender?: string | null
          gender_preference?: string | null
          has_children?: boolean | null
          has_pets?: boolean | null
          height?: number | null
          height_cm?: number | null
          height_unit?: string | null
          id: string
          latitude?: number | null
          location?: string | null
          location_updated_at?: string | null
          longitude?: number | null
          name: string
          occupation?: string | null
          pet_type?: string | null
          relationship_goal?: string | null
          show_age?: boolean | null
          streak_count?: number | null
          updated_at?: string
          verified?: boolean | null
        }
        Update: {
          age?: number | null
          bio?: string | null
          children_count?: number | null
          created_at?: string
          dob?: string | null
          education?: string | null
          email_verified?: boolean | null
          gender?: string | null
          gender_preference?: string | null
          has_children?: boolean | null
          has_pets?: boolean | null
          height?: number | null
          height_cm?: number | null
          height_unit?: string | null
          id?: string
          latitude?: number | null
          location?: string | null
          location_updated_at?: string | null
          longitude?: number | null
          name?: string
          occupation?: string | null
          pet_type?: string | null
          relationship_goal?: string | null
          show_age?: boolean | null
          streak_count?: number | null
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
        ]
      }
      streaks: {
        Row: {
          caption: string | null
          comments_count: number
          content: string
          created_at: string
          expires_at: string | null
          id: string
          likes_count: number
          song_album_art: string | null
          song_artist: string | null
          song_preview_url: string | null
          song_title: string | null
          streak_count: number
          user_id: string
        }
        Insert: {
          caption?: string | null
          comments_count?: number
          content: string
          created_at?: string
          expires_at?: string | null
          id?: string
          likes_count?: number
          song_album_art?: string | null
          song_artist?: string | null
          song_preview_url?: string | null
          song_title?: string | null
          streak_count?: number
          user_id: string
        }
        Update: {
          caption?: string | null
          comments_count?: number
          content?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          likes_count?: number
          song_album_art?: string | null
          song_artist?: string | null
          song_preview_url?: string | null
          song_title?: string | null
          streak_count?: number
          user_id?: string
        }
        Relationships: []
      }
      user_feedback: {
        Row: {
          category: string
          created_at: string
          email: string | null
          feedback: string
          id: string
          status: string
          user_id: string | null
        }
        Insert: {
          category?: string
          created_at?: string
          email?: string | null
          feedback: string
          id?: string
          status?: string
          user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          email?: string | null
          feedback?: string
          id?: string
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          accessibility_settings: Json | null
          account_settings: Json | null
          ai_companion_settings: Json | null
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
          accessibility_settings?: Json | null
          account_settings?: Json | null
          ai_companion_settings?: Json | null
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
          accessibility_settings?: Json | null
          account_settings?: Json | null
          ai_companion_settings?: Json | null
          app_customization?: Json | null
          communication_settings?: Json | null
          created_at?: string
          id?: string
          match_preferences?: Json | null
          privacy_settings?: Json | null
          security_settings?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_distance: {
        Args: {
          lat1: number
          lon1: number
          lat2: number
          lon2: number
        }
        Returns: number
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
        Args: {
          user_id: string
          max_distance: number
        }
        Returns: {
          profile_id: string
          name: string
          age: number
          distance: number
        }[]
      }
      get_user_streak_activity: {
        Args: {
          user_id: string
        }
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
