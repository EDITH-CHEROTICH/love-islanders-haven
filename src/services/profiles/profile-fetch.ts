
import { supabase } from "@/integrations/supabase/client";
import { SupabaseProfile } from "./types";

/**
 * Fetches the current user's profile data from Supabase
 */
export const fetchUserProfile = async () => {
  try {
    console.log('fetchUserProfile: Starting to fetch user profile');
    
    // Check for auth in multiple ways - both Supabase session and localStorage
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('Authentication error:', authError);
      throw new Error('Authentication error');
    }
    
    // For development, use a fallback user ID if needed
    let userId = user?.id;
    
    // If no userId but localStorage shows authenticated, create a development user ID
    if (!userId && localStorage.getItem('isAuthenticated') === 'true') {
      console.log('No authenticated user in Supabase but localStorage authenticated');
      
      // Use a consistent ID for development so the same profile is loaded each time
      userId = 'dev-user-123';
    }
    
    if (!userId) {
      console.warn('No authenticated user found');
      return null;
    }
    
    console.log('fetchUserProfile: User authenticated, id:', userId);

    // Fetch the user's profile data
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select(`
        *,
        profile_interests (interests(name))
      `)
      .eq('id', userId)
      .maybeSingle(); // Using maybeSingle instead of single to avoid errors if no profile exists

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      throw profileError;
    }
    
    if (!profileData) {
      console.warn('No profile found for user:', userId);
      return {
        id: userId,
        name: user?.email?.split('@')[0] || 'User',
        images: [],
        bio: '',
        verified: false
      };
    }
    
    console.log('fetchUserProfile: Found profile data');
    
    // Fetch the user's profile images separately
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

    // Cast relationship_goal to the allowed type values or use a default
    const relationshipGoal = profileData.relationship_goal as 'long-term' | 'casual' | 'both' | undefined;
    
    // Cast gender to the allowed type values or use a default
    const gender = profileData.gender as 'male' | 'female' | 'other' | undefined;
    
    // Cast gender_preference to match the expected literal types
    const genderPreference = profileData.gender_preference as 'male' | 'female' | 'both' | undefined;

    // Cast height_unit to the allowed type values or default to undefined
    const heightUnit = profileData.height_unit as 'ft' | 'm' | undefined;

    // Convert dob string to Date object if it exists
    const dob = profileData.dob ? new Date(profileData.dob) : undefined;

    // Transform the data to match our SupabaseProfile type
    const profile = {
      ...profileData,
      dob, // Use the converted Date object or undefined
      gender: gender || undefined, // Use undefined if gender is not set
      gender_preference: genderPreference || 'both', // Use 'both' as a default value
      relationship_goal: relationshipGoal || 'both', // Ensure it matches our type
      height_unit: heightUnit, // Use the properly cast height_unit value
      show_age: profileData.show_age !== undefined ? profileData.show_age : true, // Make sure show_age is included
      images: imageData 
        ? imageData
            .filter(img => img.is_visible)
            .sort((a, b) => a.position - b.position)
            .map(img => img.url) 
        : [],
      interests: profileData.profile_interests
        ? profileData.profile_interests.map(pi => pi.interests.name)
        : []
    };

    console.log('fetchUserProfile: Returning complete profile data');
    return profile;
  } catch (error) {
    console.error("Error in fetchUserProfile:", error);
    throw error;
  }
};
