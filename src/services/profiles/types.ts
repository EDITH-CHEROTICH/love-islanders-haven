
import { ProfilePreferences } from "@/components/ProfileSetup";

export interface SupabaseProfile {
  id: string;
  name: string;
  age: number;
  location?: string;
  bio?: string;
  gender: 'male' | 'female' | 'other';
  gender_preference: 'male' | 'female' | 'both';
  dob: string;
  show_age: boolean;
  education?: string;
  occupation?: string;
  height?: number;
  height_cm?: number;
  height_unit?: 'ft' | 'm';
  has_pets: boolean;
  pet_type?: string;
  has_children: boolean;
  children_count?: number;
  relationship_goal?: 'long-term' | 'casual' | 'both';
  verified: boolean;
  created_at: string;
  updated_at: string;
}
