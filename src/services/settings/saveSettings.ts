
import { supabase } from "@/integrations/supabase/client";
import { UserSettings } from "./types";

// Save all user settings at once
export const saveUserSettings = async (settings: UserSettings): Promise<boolean> => {
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
      .eq('user_id', userId)
      .single();
      
    // Map our complex settings to the simple table structure
    const simpleSettings = {
      user_id: userId,
      theme: settings.account_settings?.theme || 'system',
      notifications_enabled: settings.communication_settings?.notifications_enabled ?? true,
      location_sharing: settings.privacy_settings?.location_sharing ?? false,
      show_online_status: settings.privacy_settings?.show_online_status ?? true,
      updated_at: new Date().toISOString()
    };
      
    if (!existingSettings) {
      // If no settings exist, insert a new record
      const { error: insertError } = await supabase
        .from('user_settings')
        .insert(simpleSettings);
        
      if (insertError) {
        console.error('Error creating settings:', insertError);
        return false;
      }
    } else {
      // Update existing settings
      const { error: updateError } = await supabase
        .from('user_settings')
        .update(simpleSettings)
        .eq('user_id', userId);
        
      if (updateError) {
        console.error('Error updating settings:', updateError);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in saveUserSettings:', error);
    return false;
  }
};
