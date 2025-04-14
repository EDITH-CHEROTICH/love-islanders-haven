
export interface SupabaseProfile {
  id: string;
  name: string;
  email?: string;
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
  dob?: string; // Changed from Date to string to match Supabase expectations
  show_age?: boolean;
  email_verified?: boolean;
  streak_count?: number;
  // Remove height_unit and other properties that don't exist in our database structure
}

export interface Like {
  id: string;
  liker_id: string;
  liked_id: string;
  is_like: boolean;
  is_super?: boolean;
  created_at: string;
}

export interface FeedbackItem {
  id: string;
  feedback: string;
  created_at: string;
  category: string;
  status: string;
}
