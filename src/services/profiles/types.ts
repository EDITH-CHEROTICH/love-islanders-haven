
export interface SupabaseProfile {
  id: string;
  name: string;
  email?: string;
  age?: number;
  location?: string;
  bio?: string;
  avatar_url?: string;
  interests?: string[];
  verified?: boolean;
  relationship_goal?: string;
  gender?: string;
  gender_preference?: string;
  dob?: string;
  show_age?: boolean;
  email_verified?: boolean;
  streak_count?: number;
  height_cm?: number;
  occupation?: string;
  education?: string;
  exercise?: string;
  drinking_habit?: string;
  smoking_habit?: string;
  communication_style?: string;
  love_language?: string;
  zodiac_sign?: string;
  hometown?: string;
  pronouns?: string;
  city?: string;
  country?: string;
  display_name?: string;
  age_range_min?: number;
  age_range_max?: number;
  distance_preference?: number;
  show_me_verified_only?: boolean;
  onboarding_completed?: boolean;
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
