
export interface SupabaseProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  bio: string;
  images?: string[]; // Make optional since it's handled separately in the database
  interests?: string[]; // Make optional since it's handled separately in the database
  verified?: boolean;
  relationship_goal?: 'long-term' | 'casual' | 'both';
  videos?: string[];
  gender?: 'male' | 'female' | 'other';
  gender_preference?: 'male' | 'female' | 'both';
  dob?: Date;
  show_age?: boolean;
  education?: string;
  height?: number;
  height_cm?: number;
  height_unit?: 'ft' | 'm';
  has_pets?: boolean;
  pet_type?: string;
  has_children?: boolean;
  children_count?: number;
  occupation?: string;
  activity_status?: string;
  // Fields from database that weren't in the original interface
  created_at?: string;
  updated_at?: string;
  latitude?: number;
  longitude?: number;
  location_updated_at?: string;
  streak_count?: number;
  email_verified?: boolean;
  // For internal use - not directly serialized/deserialized
  profile_interests?: Array<{
    interests?: {
      name: string;
    };
  }>;
}

export interface Like {
  id: string;
  liker_id: string;
  liked_id: string;
  is_like: boolean;
  is_super?: boolean;
  created_at: string;
}
