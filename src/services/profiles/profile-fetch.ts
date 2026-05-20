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
          .select('*')
          .eq('id', userId)
          .maybeSingle();
  
        if (profileError) {
          console.error('Error fetching profile:', profileError);
          reject(profileError);
          return;
        }
        
        // If we have profile data, transform it to match our SupabaseProfile type
        if (profileData) {
          // First cast to unknown to avoid type issues, then cast to SupabaseProfile
          resolve(transformProfileData(profileData));
        } else {
          resolve(null);
        }
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

    // Create a profile object with image data
    const profile = {
      ...profileData,
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
    
    // For development and mobile testing, return a fallback profile
    if (localStorage.getItem('isAuthenticated') === 'true') {
      console.log('Creating fallback development profile due to error');
      return createFallbackProfile();
    }
    
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
  };
}

/**
 * Creates a fallback profile for development and offline scenarios
 */
function createFallbackProfile(userId = 'dev-user-123', email?: string | null): SupabaseProfile {
  return {
    id: userId,
    name: email?.split('@')[0] || 'Development User',
    bio: 'This is a fallback profile for development and offline use.',
    verified: false,
    gender_preference: 'both' as 'male' | 'female' | 'both',
    relationship_goal: 'both' as 'long-term' | 'casual' | 'both',
    age: 25, // Adding required age property
    location: 'Unknown', // Adding required location property
    email_verified: false,
    show_age: true
  };
}
