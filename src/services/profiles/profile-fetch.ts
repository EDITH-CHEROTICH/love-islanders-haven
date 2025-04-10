
import { supabase } from "@/integrations/supabase/client";
import { SupabaseProfile } from "./types";

/**
 * Fetches the current user's profile data from Supabase
 */
export const fetchUserProfile = async () => {
  try {
    console.log('fetchUserProfile: Starting to fetch user profile');
    
    // Add network connection check - important for mobile
    if (!navigator.onLine) {
      console.log('Device appears to be offline');
      // For development and mobile testing, use fallback approach
      if (localStorage.getItem('isAuthenticated') === 'true') {
        console.log('Using offline fallback authentication');
        return createFallbackProfile();
      } else {
        throw new Error('No internet connection');
      }
    }
    
    // Check for auth in multiple ways - both Supabase session and localStorage
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.log('Authentication error in fetchUserProfile:', authError.message);
      // For development and testing, continue if localStorage shows authenticated
      if (localStorage.getItem('isAuthenticated') === 'true') {
        console.log('Using development authentication from localStorage');
        return createFallbackProfile();
      } else {
        throw new Error('Authentication error');
      }
    }
    
    // For development, use a fallback user ID if needed
    let userId = user?.id;
    
    // If no userId but localStorage shows authenticated, create a development user ID
    if (!userId && localStorage.getItem('isAuthenticated') === 'true') {
      console.log('No authenticated user in Supabase but localStorage authenticated');
      userId = 'dev-user-123';
    }
    
    if (!userId) {
      console.warn('No authenticated user found');
      return null;
    }
    
    console.log('fetchUserProfile: User authenticated, id:', userId);

    // Fetch the user's profile data with a timeout for mobile networks
    const profilePromise = new Promise<SupabaseProfile | null>(async (resolve, reject) => {
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select(`
            *,
            profile_interests (interests(name))
          `)
          .eq('id', userId)
          .maybeSingle();
  
        if (profileError) {
          console.error('Error fetching profile:', profileError);
          reject(profileError);
          return;
        }
        
        resolve(profileData as SupabaseProfile | null);
      } catch (err) {
        reject(err);
      }
    });
    
    // Set a timeout to handle slow connections on mobile
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Profile fetch timeout')), 10000);
    });
    
    // Race the profile fetch against a timeout
    const profileData = await Promise.race<SupabaseProfile | null>([profilePromise, timeoutPromise])
      .catch(error => {
        console.error('Profile fetch failed or timed out:', error);
        return null;
      });
    
    if (!profileData) {
      console.warn('No profile found for user:', userId);
      return createFallbackProfile(userId, user?.email);
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
    const profile: SupabaseProfile = {
      ...profileData as SupabaseProfile,
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
    
    // For development and mobile testing, return a fallback profile
    if (localStorage.getItem('isAuthenticated') === 'true') {
      console.log('Creating fallback development profile due to error');
      return createFallbackProfile();
    }
    
    throw error;
  }
};

/**
 * Creates a fallback profile for development and offline scenarios
 */
function createFallbackProfile(userId = 'dev-user-123', email?: string | null): SupabaseProfile {
  return {
    id: userId,
    name: email?.split('@')[0] || 'Development User',
    images: [],
    bio: 'This is a fallback profile for development and offline use.',
    verified: false,
    gender_preference: 'both' as 'male' | 'female' | 'both',
    relationship_goal: 'both' as 'long-term' | 'casual' | 'both',
    age: 25, // Adding required age property
    location: 'Unknown' // Adding required location property
  };
}
