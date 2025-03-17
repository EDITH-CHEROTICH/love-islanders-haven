
import { supabase } from "@/integrations/supabase/client";
import { UserSettings } from "./types";
import { Json } from "@/integrations/supabase/types";

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
      .eq('id', userId)
      .single();
      
    if (!existingSettings) {
      // If no settings exist, insert a new record
      const { error: insertError } = await supabase
        .from('user_settings')
        .insert({
          id: userId,
          account_settings: settings.account_settings as Json,
          privacy_settings: settings.privacy_settings as Json,
          match_preferences: settings.match_preferences as Json,
          communication_settings: settings.communication_settings as Json,
          ai_companion_settings: settings.ai_companion_settings as Json,
          accessibility_settings: settings.accessibility_settings as Json,
          security_settings: settings.security_settings as Json,
          app_customization: settings.app_customization as Json,
          updated_at: new Date().toISOString()
        });
        
      if (insertError) {
        console.error('Error creating settings:', insertError);
        return false;
      }
    } else {
      // Update existing settings
      const { error: updateError } = await supabase
        .from('user_settings')
        .update({
          account_settings: settings.account_settings as Json,
          privacy_settings: settings.privacy_settings as Json,
          match_preferences: settings.match_preferences as Json,
          communication_settings: settings.communication_settings as Json,
          ai_companion_settings: settings.ai_companion_settings as Json,
          accessibility_settings: settings.accessibility_settings as Json,
          security_settings: settings.security_settings as Json,
          app_customization: settings.app_customization as Json,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
        
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
