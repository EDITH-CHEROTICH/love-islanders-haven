import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

/**
 * Save an image URL to a user's profile
 */
export const saveProfileImage = async (
  imageUrl: string, 
  position: number,
  isVisible = true
) => {
  try {
    const { data, error: authError } = await supabase.auth.getSession();
    
    // For development or when Supabase auth is not fully available
    const userId = data?.session?.user?.id || 
                  (localStorage.getItem('isAuthenticated') === 'true' ? 'dev-user-123' : null);
    
    if (!userId) throw new Error('User not authenticated');
    
    const { error } = await supabase
      .from('profile_images')
      .insert({
        profile_id: userId,
        url: imageUrl,
        position,
        is_visible: isVisible
      });
  
    if (error) {
      console.error("Error saving profile image:", error);
      throw error;
    }
    return true;
  } catch (error) {
    console.error("Error in saveProfileImage:", error);
    throw error;
  }
};

/**
 * Delete a profile image by URL
 */
export const deleteProfileImage = async (imageUrl: string) => {
  try {
    const { data, error: authError } = await supabase.auth.getSession();
    
    // For development or when Supabase auth is not fully available
    const userId = data?.session?.user?.id || 
                  (localStorage.getItem('isAuthenticated') === 'true' ? 'dev-user-123' : null);
    
    if (!userId) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('profile_images')
      .delete()
      .eq('profile_id', userId)
      .eq('url', imageUrl);

    if (error) {
      console.error("Error deleting profile image:", error);
      throw error;
    }
    return true;
  } catch (error) {
    console.error("Error in deleteProfileImage:", error);
    throw error;
  }
};

/**
 * Save a video URL to a user's profile
 */
export const saveProfileVideo = async (videoUrl: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('profile_videos')
    .insert({
      profile_id: user.id,
      url: videoUrl
    });

  if (error) throw error;
  return true;
};

/**
 * Upload a profile image to Supabase storage and return the URL
 */
export const uploadProfileImage = async (file: File): Promise<string> => {
  try {
    const { data, error: authError } = await supabase.auth.getSession();
    
    // For development or when Supabase auth is not fully available
    const userId = data?.session?.user?.id || 
                  (localStorage.getItem('isAuthenticated') === 'true' ? 'dev-user-123' : null);
    
    if (!userId) throw new Error('User not authenticated');
    
    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;
    
    // Check if storage bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === 'profile-images');
    
    // Use public bucket if it exists, otherwise fallback
    const bucketName = bucketExists ? 'profile-images' : 'avatars';
    
    // Upload to storage
    const { error: uploadError, data: uploadData } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });
      
    if (uploadError) {
      console.error("Error uploading to storage:", uploadError);
      throw uploadError;
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
      
    return publicUrl;
  } catch (error) {
    console.error("Error in uploadProfileImage:", error);
    throw error;
  }
};

/**
 * Fetch visible profile images for a user
 */
export const fetchVisibleProfileImages = async (profileId: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('profile_images')
      .select('url')
      .eq('profile_id', profileId)
      .eq('is_visible', true)
      .order('position', { ascending: true });
      
    if (error) {
      console.error('Error fetching visible profile images:', error);
      throw error;
    }
    
    return data ? data.map(img => img.url) : [];
  } catch (error) {
    console.error("Error in fetchVisibleProfileImages:", error);
    return [];
  }
};

/**
 * Fetch all profile images for the currently logged-in user
 */
export const fetchCurrentUserProfileImages = async (): Promise<string[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    
    const { data, error } = await supabase
      .from('profile_images')
      .select('url')
      .eq('profile_id', user.id)
      .order('position', { ascending: true });
      
    if (error) {
      console.error('Error fetching user profile images:', error);
      throw error;
    }
    
    return data ? data.map(img => img.url) : [];
  } catch (error) {
    console.error("Error in fetchCurrentUserProfileImages:", error);
    return [];
  }
};

/**
 * Update the position of a profile image
 */
export const updateProfileImagePosition = async (
  imageUrl: string,
  newPosition: number
): Promise<boolean> => {
  try {
    const { data, error: authError } = await supabase.auth.getSession();
    
    // For development or when Supabase auth is not fully available
    const userId = data?.session?.user?.id || 
                  (localStorage.getItem('isAuthenticated') === 'true' ? 'dev-user-123' : null);
    
    if (!userId) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('profile_images')
      .update({ position: newPosition })
      .eq('profile_id', userId)
      .eq('url', imageUrl);

    if (error) {
      console.error('Error updating image position:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error in updateProfileImagePosition:', error);
    return false;
  }
};

/**
 * Update the visibility of a profile image
 */
export const updateProfileImageVisibility = async (
  imageUrl: string,
  isVisible: boolean
): Promise<boolean> => {
  try {
    const { data, error: authError } = await supabase.auth.getSession();
    
    // For development or when Supabase auth is not fully available
    const userId = data?.session?.user?.id || 
                  (localStorage.getItem('isAuthenticated') === 'true' ? 'dev-user-123' : null);
    
    if (!userId) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('profile_images')
      .update({ is_visible: isVisible })
      .eq('profile_id', userId)
      .eq('url', imageUrl);

    if (error) {
      console.error('Error updating image visibility:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error in updateProfileImageVisibility:', error);
    return false;
  }
};
