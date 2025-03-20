export interface SupabaseProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  bio: string;
  images: string[];
  interests: string[];
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
}

export interface Like {
  id: string;
  liker_id: string;
  liked_id: string;
  is_like: boolean;
  is_super?: boolean;
  created_at: string;
}
