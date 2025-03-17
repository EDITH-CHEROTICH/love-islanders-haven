
import { supabase } from "@/integrations/supabase/client";
import { UserSettings } from "./types";
import { Json } from "@/integrations/supabase/types";

// Update specific settings category
export const updateSettingsCategory = async <T extends keyof UserSettings>(
  category: T,
  settings: UserSettings[T]
): Promise<boolean> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      throw new Error('Not authenticated');
    }
    
    const userId = userData.user.id;
    
    // First check if a settings record exists
    const { data: existingSettings } = await supabase
      .from('user_settings')
      .select('id')
      .eq('id', userId)
      .single();
      
    if (!existingSettings) {
      // If no settings exist, create a new record with defaults
      const { error: insertError } = await supabase
        .from('user_settings')
        .insert({
          id: userId,
          [category]: settings as Json,
          updated_at: new Date().toISOString()
        });
        
      if (insertError) {
        console.error(`Error creating settings for ${category}:`, insertError);
        return false;
      }
    } else {
      // Update existing settings
      const { error: updateError } = await supabase
        .from('user_settings')
        .update({ 
          [category]: settings as Json,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
        
      if (updateError) {
        console.error(`Error updating ${category}:`, updateError);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error(`Error in updateSettingsCategory for ${category}:`, error);
    return false;
  }
};
