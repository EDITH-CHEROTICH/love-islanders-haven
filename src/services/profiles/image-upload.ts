
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

/**
 * Uploads a profile image to storage and adds it to the profile_images table
 */
export const uploadProfileImage = async (
  file: File, 
  position: number = 0
): Promise<string> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User must be authenticated to upload images");
    }
    
    // Create unique file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;
    
    // Upload image to storage
    const { error: uploadError } = await supabase.storage
      .from('profile_images')
      .upload(filePath, file);
    
    if (uploadError) {
      console.error("Error uploading image:", uploadError);
      throw uploadError;
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('profile_images')
      .getPublicUrl(filePath);
    
    if (!publicUrl) {
      throw new Error("Failed to get public URL for uploaded image");
    }
    
    // Add image to profile_images table
    const { error: dbError } = await supabase
      .from('profile_images')
      .insert({
        profile_id: user.id,
        url: publicUrl,
        position,
        is_visible: true
      });
    
    if (dbError) {
      console.error("Error saving image to database:", dbError);
      throw dbError;
    }
    
    return publicUrl;
  } catch (error) {
    console.error("Error in uploadProfileImage:", error);
    throw error;
  }
};

/**
 * Gets all images for a profile
 */
export const getProfileImages = async (profileId: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('profile_images')
      .select('url, position')
      .eq('profile_id', profileId)
      .eq('is_visible', true)
      .order('position');
    
    if (error) {
      throw error;
    }
    
    return data.map(img => img.url);
  } catch (error) {
    console.error("Error fetching profile images:", error);
    return [];
  }
};

/**
 * Updates the order of profile images
 */
export const updateImageOrder = async (
  imageUrls: string[]
): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User must be authenticated to update images");
    }
    
    // Update positions for each image
    for (let i = 0; i < imageUrls.length; i++) {
      const url = imageUrls[i];
      const { error } = await supabase
        .from('profile_images')
        .update({ position: i })
        .eq('profile_id', user.id)
        .eq('url', url);
      
      if (error) {
        console.error(`Error updating position for image ${url}:`, error);
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error updating image order:", error);
    return false;
  }
};

/**
 * Deletes a profile image
 */
export const deleteProfileImage = async (imageUrl: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User must be authenticated to delete images");
    }
    
    // Mark image as not visible instead of deleting
    const { error } = await supabase
      .from('profile_images')
      .update({ is_visible: false })
      .eq('profile_id', user.id)
      .eq('url', imageUrl);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting profile image:", error);
    return false;
  }
};
