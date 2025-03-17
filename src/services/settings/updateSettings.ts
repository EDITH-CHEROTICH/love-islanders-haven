
import { supabase } from "@/integrations/supabase/client";
import { UserSettings } from "./types";
import { Json } from "@/integrations/supabase/types";

// Update specific settings category
export const updateSettingsCategory = async <T extends keyof UserSettings>(
  category: T,
  settings: UserSettings[T]
): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('Not authenticated');
    }
    
    const { error } = await supabase
      .from('user_settings')
      .update({ 
        [category]: settings as Json,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.user.id);
    
    if (error) {
      console.error(`Error updating ${category}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Error in updateSettingsCategory for ${category}:`, error);
    return false;
  }
};
