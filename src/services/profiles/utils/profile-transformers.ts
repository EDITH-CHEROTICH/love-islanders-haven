
import { SupabaseProfile } from "../types";

/**
 * Create a fallback profile for development/testing
 */
export function createFallbackProfile(userId: string = 'dev-user-123', email?: string | null): SupabaseProfile {
  const developmentProfile: SupabaseProfile = {
    id: userId,
    name: email ? email.split('@')[0] : 'Test User',
    bio: 'This is a fallback profile for development.',
    gender: null,
    gender_preference: 'both',
    location: 'Test Location',
    education: null,
    occupation: null,
    relationship_goal: 'both',
    verified: false,
    email_verified: true,
    images: [],
    show_age: true,
    age: 25,
    dob: new Date().toISOString(), // Use ISO string instead of Date object
    streak_count: 0,
    videos: []
  };

  console.log("Created fallback profile for development:", developmentProfile);
  return developmentProfile;
}

/**
 * Transform profile data from Supabase to our SupabaseProfile type
 */
export function transformProfileData(data: any): SupabaseProfile {
  // Extract interests if they exist
  const interests = data.profile_interests?.map((item: any) => item.interests?.name).filter(Boolean) || [];
  
  // Transform the data to match our SupabaseProfile type
  return {
    id: data.id,
    name: data.name,
    bio: data.bio,
    gender: data.gender,
    gender_preference: data.gender_preference,
    age: data.age,
    dob: data.dob, // Keep as string from database
    show_age: data.show_age,
    location: data.location,
    education: data.education,
    occupation: data.occupation,
    relationship_goal: data.relationship_goal,
    verified: data.verified || false,
    email_verified: data.email_verified || false,
    streak_count: data.streak_count || 0,
    interests,
    images: [], // Images are loaded separately
    videos: data.videos || []
  };
}

/**
 * Transform profile data for display
 */
export function transformProfileForDisplay(profile: SupabaseProfile) {
  return {
    ...profile,
    // No transformation needed for dob since it's already a string
  };
}
