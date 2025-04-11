
import { supabase } from "@/integrations/supabase/client";
import { getAuthenticatedUserId } from "../utils/profile-auth";
import { SupabaseProfile } from "../types";
import { createFallbackProfile, transformProfileData } from "../utils/profile-transformers";

/**
 * Fetches the user's profile from Supabase
 */
export const fetchUserProfile = async (): Promise<SupabaseProfile> => {
  try {
    // Get the authenticated user ID or fallback to development ID
    const userId = await getAuthenticatedUserId();
    
    if (!userId) {
      console.log('No authenticated user ID found, using fallback profile');
      return createFallbackProfile('dev-user-123');
    }
    
    // Query the user's profile with comprehensive details
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        name,
        bio,
        gender,
        gender_preference,
        age,
        dob,
        show_age,
        relationship_goal,
        occupation,
        education,
        verified,
        email_verified,
        location
      `)
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
      
      // For development, return a fallback profile after a real error
      if (process.env.NODE_ENV === 'development') {
        console.log('Using fallback profile for development');
        return createFallbackProfile(userId);
      }
      
      throw error;
    }
    
    // In development, if no data is found (empty object), use a fallback
    if (!data && process.env.NODE_ENV === 'development') {
      console.log('No profile found, using fallback profile for development');
      return createFallbackProfile(userId);
    }
    
    // Fetch related profile images with a timeout to prevent hanging
    const imagePromise = new Promise(async (resolve) => {
      try {
        const { data: profileImages, error: imageError } = await supabase
          .from('profile_images')
          .select('*')
          .eq('profile_id', userId)
          .order('position', { ascending: true });
          
        if (imageError) {
          console.error('Error fetching profile images:', imageError);
          resolve([]);
        } else {
          resolve(profileImages || []);
        }
      } catch (err) {
        console.error('Error in image fetch:', err);
        resolve([]);
      }
    });
    
    // Set a timeout for image fetching
    const timeoutPromise = new Promise((resolve) => {
      setTimeout(() => {
        console.log('Image fetch timed out');
        resolve([]);
      }, 3000);
    });
    
    // Race the image fetch against a timeout
    const profileImages = await Promise.race([imagePromise, timeoutPromise]);
    
    // Transform the profile data to match our SupabaseProfile type
    const transformedProfile = transformProfileData(data);
    
    // Add images to the profile
    const profileWithImages = {
      ...transformedProfile,
      images: Array.isArray(profileImages) ? 
        profileImages.map((img: any) => img.url) : []
    };
    
    console.log("Fetched user profile:", profileWithImages);
    
    return profileWithImages;
  } catch (error) {
    console.error('Error in fetchUserProfile:', error);
    
    // For development, return a fallback profile after any error
    if (process.env.NODE_ENV === 'development') {
      const userId = await getAuthenticatedUserId() || 'dev-user-123';
      console.log('Using fallback profile after error for development');
      return createFallbackProfile(userId);
    }
    
    throw error;
  }
};
