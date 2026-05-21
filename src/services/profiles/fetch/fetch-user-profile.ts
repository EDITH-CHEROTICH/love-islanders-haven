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
    let { data: profileData, error: profileError } = await supabase
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
      const fallbackName = user.user_metadata?.name || user.email?.split('@')[0] || 'New User';
      const { data: createdProfile, error: createError } = await supabase
        .from('profiles')
        .upsert({ id: userId, email: user.email, name: fallbackName, onboarding_completed: false }, { onConflict: 'id' })
        .select('*')
        .single();

      if (createError) {
        console.error('Error creating missing profile:', createError);
        throw createError;
      }

      profileData = createdProfile;
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
  // Interests stored directly as an array column on profiles
  const interests = Array.isArray(rawData.interests) ? rawData.interests : [];

  // Keep dob as string from the database
  const dob = rawData.dob || undefined;
  
  // Cast enums to their proper types
  const relationshipGoal = rawData.relationship_goal as 'long-term' | 'casual' | 'both' | undefined;
  const gender = rawData.gender as 'male' | 'female' | 'other' | undefined;
  const genderPreference = rawData.gender_preference as 'male' | 'female' | 'both' | undefined;
  
  return {
    id: rawData.id,
    name: rawData.name || '',
    email: rawData.email || undefined,
    displayName: rawData.display_name || rawData.name || '',
    display_name: rawData.display_name || undefined,
    age: rawData.age || 0,
    location: rawData.location || '',
    bio: rawData.bio || '',
    verified: rawData.verified || false,
    avatar_url: rawData.avatar_url || undefined,
    dob,
    gender,
    genderPreference: genderPreference || 'both',
    gender_preference: genderPreference || 'both',
    relationshipGoal: relationshipGoal || 'both',
    relationship_goal: relationshipGoal || 'both',
    showAge: rawData.show_age !== undefined ? rawData.show_age : true,
    show_age: rawData.show_age !== undefined ? rawData.show_age : true,
    interests,
    streak_count: rawData.streak_count || 0,
    email_verified: rawData.email_verified || false,
    occupation: rawData.occupation || '',
    education: rawData.education || '',
    exercise: rawData.exercise || '',
    drinking: rawData.drinking_habit || '',
    drinking_habit: rawData.drinking_habit || '',
    smoking: rawData.smoking_habit || '',
    smoking_habit: rawData.smoking_habit || '',
    heightCm: rawData.height_cm || undefined,
    height_cm: rawData.height_cm || undefined,
    height: rawData.height_cm ? String(rawData.height_cm) : '',
    distance: 0,
    lastActive: rawData.updated_at || rawData.created_at || new Date().toISOString(),
    // Include other fields from SupabaseProfile as needed
  };
}
