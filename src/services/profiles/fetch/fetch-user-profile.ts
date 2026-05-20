import { supabase } from "@/integrations/supabase/client";
import { SupabaseProfile } from "../types";

/**
 * Fetches the current user's profile data from Supabase
 */
export const fetchUserProfile = async () => {
  try {
    console.log('fetchUserProfile: Starting to fetch user profile');
    
    // Add network connection check
    if (!navigator.onLine) {
      console.log('Device appears to be offline');
      throw new Error('No internet connection');
    }
    
    // Get the current user ID
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.log('Authentication error in fetchUserProfile:', authError.message);
      throw new Error('Authentication error');
    }
    
    let userId = user?.id;
    
    if (!userId) {
      console.warn('No authenticated user found');
      return null;
    }
    
    console.log('fetchUserProfile: User authenticated, id:', userId);

    // Fetch the user's profile data
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      throw profileError;
    }
    
    if (!profileData) {
      console.warn('No profile found for user:', userId);
      return null;
    }
    
    console.log('fetchUserProfile: Found profile data');
    
    // Fetch the user's profile images
    const { data: imageData, error: imageError } = await supabase
      .from('profile_images')
      .select('url, position, is_visible')
      .eq('profile_id', userId)
      .order('position', { ascending: true });
      
    if (imageError) {
      console.error('Error fetching profile images:', imageError);
    } else {
      console.log('fetchUserProfile: Found image data:', imageData?.length || 0, 'images');
    }

    // Create a profile object with image data
    const profile = {
      ...transformProfileData(profileData),
      images: imageData 
        ? imageData
            .filter(img => img.is_visible)
            .sort((a, b) => a.position - b.position)
            .map(img => img.url) 
        : []
    };

    console.log('fetchUserProfile: Returning complete profile data');
    return profile;
  } catch (error) {
    console.error("Error in fetchUserProfile:", error);
    throw error;
  }
};

/**
 * Transforms raw database data into a typed SupabaseProfile
 */
function transformProfileData(rawData: any): SupabaseProfile {
  // Handle profile interests
  const interests = rawData.profile_interests 
    ? rawData.profile_interests
        .map((pi: any) => pi.interests?.name)
        .filter(Boolean) 
    : [];

  // Keep dob as string from the database
  const dob = rawData.dob || undefined;
  
  // Cast enums to their proper types
  const relationshipGoal = rawData.relationship_goal as 'long-term' | 'casual' | 'both' | undefined;
  const gender = rawData.gender as 'male' | 'female' | 'other' | undefined;
  const genderPreference = rawData.gender_preference as 'male' | 'female' | 'both' | undefined;
  
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
    show_age: rawData.show_age !== undefined ? rawData.show_age : true,
    interests,
    streak_count: rawData.streak_count || 0,
    email_verified: rawData.email_verified || false,
    // Include other fields from SupabaseProfile as needed
  };
}
