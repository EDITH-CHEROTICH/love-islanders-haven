
import { supabase } from "@/integrations/supabase/client";
import { getAuthenticatedUserId } from "../utils/profile-auth";
import { createFallbackProfile, transformProfileData } from "../utils/profile-transformers";
import { fetchProfileImages } from "../utils/profile-images";
import { SupabaseProfile } from "../types";

/**
 * Fetches the current user's profile data from Supabase
 */
export const fetchUserProfile = async () => {
  try {
    console.log('fetchUserProfile: Starting to fetch user profile');
    
    const userId = await getAuthenticatedUserId();
    
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
      const user = (await supabase.auth.getUser()).data.user;
      return createFallbackProfile(userId, user?.email);
    }
    
    console.log('fetchUserProfile: Found profile data');
    
    // Fetch the user's profile images separately
    const images = await fetchProfileImages(userId);

    // Create a complete profile object with image data
    const profile = {
      ...profileData,
      images
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
