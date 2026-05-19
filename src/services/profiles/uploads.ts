
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

/**
 * Uploads an image to Supabase storage and returns the public URL
 */
export const uploadProfileImage = async (file: File, position: number = 0): Promise<string> => {
  // First, check for valid session
  const { data, error: sessionError } = await supabase.auth.getSession();
  
  let userId = data.session?.user.id;
  
  // If no userId but localStorage shows authenticated, create a development user ID
  if (!userId && (localStorage.getItem('isAuthenticated') === 'true' || import.meta.env.MODE === 'development')) {
    console.log('Using development user ID for uploads');
    userId = 'dev-user-123';
  }
  
  if (!userId) {
    toast.error("Authentication required to upload images");
    throw new Error('User not authenticated');
  }

  try {
    console.log("Starting image upload for user:", userId, "file:", file.name);
    
    // Create a unique file name to prevent collisions
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Ensure the file is valid
    if (!file || file.size === 0) {
      toast.error("Invalid file selected");
      throw new Error('Invalid file');
    }
    
    // Check if file size is within limits (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds 10MB limit");
      throw new Error('File too large');
    }
    
    console.log("Uploading file:", fileName, "Size:", file.size, "Type:", file.type);

    // Upload the file to Supabase storage
    const { data: uploadData, error } = await supabase.storage
      .from('profile-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading image:', error);
      
      // Check specific error messages
      if (error.message.includes('storage quota')) {
        toast.error("Storage quota exceeded. Please delete some images first.");
      } else if (error.message.includes('permission')) { 
        toast.error("You don't have permission to upload images.");
      } else {
        toast.error("Failed to upload image. Please try again.");
      }
      
      throw error;
    }

    console.log("Upload successful, getting public URL");
    
    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('profile-images')
      .getPublicUrl(filePath);

    console.log("Image successfully uploaded with URL:", publicUrl);
    
    // After successful upload, update the profile with the image URL
    try {
      const { error: profileError } = await supabase
        .from('profile_images')
        .insert({
          profile_id: userId,
          url: publicUrl,
          position: position, 
          is_visible: true
        });
        
      if (profileError) {
        console.error('Error updating profile with image:', profileError);
      }
    } catch (profileUpdateError) {
      console.error('Error linking image to profile:', profileUpdateError);
    }
    
    return publicUrl;
  } catch (error) {
    console.error('Error in uploadProfileImage:', error);
    throw new Error('Failed to upload image. Please check your network connection and try again.');
  }
};
