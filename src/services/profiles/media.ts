
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
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('profile_images')
    .insert({
      profile_id: user.id,
      url: imageUrl,
      position,
      is_visible: isVisible
    });

  if (error) throw error;
  return true;
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
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');
  
  // Create a unique file name
  const fileExt = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `${user.id}/${fileName}`;
  
  // Upload to storage
  const { error: uploadError, data } = await supabase.storage
    .from('profile-images')
    .upload(filePath, file);
    
  if (uploadError) throw uploadError;
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('profile-images')
    .getPublicUrl(filePath);
    
  return publicUrl;
};

/**
 * Fetch visible profile images for a user
 */
export const fetchVisibleProfileImages = async (profileId: string): Promise<string[]> => {
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
};
