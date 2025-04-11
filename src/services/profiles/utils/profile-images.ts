
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches profile images for a given user ID
 */
export async function fetchProfileImages(userId: string): Promise<string[]> {
  try {
    const { data: imageData, error: imageError } = await supabase
      .from('profile_images')
      .select('url, position, is_visible')
      .eq('profile_id', userId)
      .order('position', { ascending: true });
      
    if (imageError) {
      console.error('Error fetching profile images:', imageError);
      return [];
    }
    
    console.log('Found image data:', imageData?.length || 0, 'images');
    
    // Return only visible images, sorted by position
    return imageData 
      ? imageData
          .filter(img => img.is_visible)
          .sort((a, b) => a.position - b.position)
          .map(img => img.url) 
      : [];
  } catch (error) {
    console.error('Error fetching profile images:', error);
    return [];
  }
}
