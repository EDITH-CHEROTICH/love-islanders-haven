
import { supabase } from "@/integrations/supabase/client";
import { UserSettings } from "./types";
import { Json } from "@/integrations/supabase/types";

// Save all user settings at once
export const saveUserSettings = async (settings: UserSettings): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('Not authenticated');
    }
    
    const { error } = await supabase
      .from('user_settings')
      .upsert({
        id: user.user.id,
        account_settings: settings.account_settings as Json,
        privacy_settings: settings.privacy_settings as Json,
        match_preferences: settings.match_preferences as Json,
        communication_settings: settings.communication_settings as Json,
        ai_companion_settings: settings.ai_companion_settings as Json,
        accessibility_settings: settings.accessibility_settings as Json,
        security_settings: settings.security_settings as Json,
        app_customization: settings.app_customization as Json,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });
    
    if (error) {
      console.error('Error saving settings:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in saveUserSettings:', error);
    return false;
  }
};
