
import { SupabaseProfile } from "../types";

/**
 * Transforms raw database data into a typed SupabaseProfile
 */
export function transformProfileData(rawData: any): SupabaseProfile {
  // Handle profile interests
  const interests = rawData.profile_interests 
    ? rawData.profile_interests
        .map((pi: any) => pi.interests?.name)
        .filter(Boolean) 
    : [];

  // Convert string date to Date object if exists
  const dob = rawData.dob ? new Date(rawData.dob) : undefined;
  
  // Cast enums to their proper types
  const relationshipGoal = rawData.relationship_goal as 'long-term' | 'casual' | 'both' | undefined;
  const gender = rawData.gender as 'male' | 'female' | 'other' | undefined;
  const genderPreference = rawData.gender_preference as 'male' | 'female' | 'both' | undefined;
  const heightUnit = rawData.height_unit as 'ft' | 'm' | undefined;
  
  return {
    id: rawData.id,
    name: rawData.name || '',
    age: rawData.age || 0,
    location: rawData.location || '',
    bio: rawData.bio || '',
    verified: rawData.verified || false,
    dob,
    gender,
    gender_preference: genderPreference || 'both',
    relationship_goal: relationshipGoal || 'both',
    height_unit: heightUnit,
    show_age: rawData.show_age !== undefined ? rawData.show_age : true,
    interests,
    // Include other fields from SupabaseProfile as needed
    email_verified: rawData.email_verified || false,
    education: rawData.education,
    height: rawData.height,
    height_cm: rawData.height_cm,
    has_pets: rawData.has_pets || false,
    pet_type: rawData.pet_type,
    has_children: rawData.has_children || false,
    children_count: rawData.children_count || 0,
    occupation: rawData.occupation,
    activity_status: rawData.activity_status,
    // Add empty images array (will be populated later)
    images: []
  };
}

/**
 * Creates a fallback profile for development and offline scenarios
 */
export function createFallbackProfile(userId = 'dev-user-123', email?: string | null): SupabaseProfile {
  return {
    id: userId,
    name: email?.split('@')[0] || 'Development User',
    images: [],
    bio: 'This is a fallback profile for development and offline use.',
    verified: false,
    gender_preference: 'both' as 'male' | 'female' | 'both',
    relationship_goal: 'both' as 'long-term' | 'casual' | 'both',
    age: 25, // Adding required age property
    location: 'Unknown', // Adding required location property
    has_pets: false,
    has_children: false,
    children_count: 0,
    email_verified: false,
    show_age: true
  };
}
