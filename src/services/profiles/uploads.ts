
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

/**
 * Uploads an image to Supabase storage and returns the public URL
 */
export const uploadProfileImage = async (file: File): Promise<string> => {
  // First, check for valid session
  const { data, error: sessionError } = await supabase.auth.getSession();
  
  let userId = data.session?.user.id;
  
  // If no userId but localStorage shows authenticated, create a development user ID
  if (!userId && localStorage.getItem('isAuthenticated') === 'true') {
    console.log('Using development user ID for uploads');
    userId = 'dev-user-123';
  }
  
  if (!userId) {
    throw new Error('User not authenticated');
  }

  // Create a unique file name to prevent collisions
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${uuidv4()}.${fileExt}`;
  const filePath = `profiles/${fileName}`;

  // Upload the file to Supabase storage
  const { data: uploadData, error } = await supabase.storage
    .from('profile-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Error uploading image:', error);
    throw error;
  }

  // Get the public URL for the uploaded file
  const { data: { publicUrl } } = supabase.storage
    .from('profile-images')
    .getPublicUrl(filePath);

  return publicUrl;
};
