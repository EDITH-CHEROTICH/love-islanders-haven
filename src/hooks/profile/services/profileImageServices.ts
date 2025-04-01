
import { supabase } from "@/integrations/supabase/client";
import { ImageVisibility } from "../types/profileImageTypes";

export const fetchImageVisibilitiesFromDB = async (): Promise<ImageVisibility[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  
  try {
    const { data, error } = await supabase
      .from('profile_images')
      .select('url, position, is_visible')
      .eq('profile_id', user.id)
      .order('position', { ascending: true });
      
    if (error) throw error;
    
    if (data && data.length) {
      return data.map(item => ({
        imageUrl: item.url,
        isVisible: item.is_visible !== false,
        position: item.position
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching image visibilities:', error);
    return [];
  }
};

export const updateImageVisibilityInDB = async (
  imageUrl: string, 
  isVisible: boolean
): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    const { error } = await supabase
      .from('profile_images')
      .update({ is_visible: isVisible })
      .eq('profile_id', user.id)
      .eq('url', imageUrl);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error updating image visibility:', error);
    return false;
  }
};

export const updateImagePositionInDB = async (
  imageUrl: string,
  position: number
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profile_images')
      .update({ position })
      .eq('url', imageUrl);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error updating image position:', error);
    return false;
  }
};
