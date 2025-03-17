
import { supabase } from "@/integrations/supabase/client";
import { UserSettings } from "./types";
import { defaultSettings } from "./defaults";
import { safelyMergeSettings } from "./utils";
import { saveUserSettings } from "./saveSettings";

// Fetch user settings from Supabase
export const fetchUserSettings = async (): Promise<UserSettings> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('Not authenticated');
    }
    
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('id', user.user.id)
      .single();
    
    if (error) {
      // If the error is that the row doesn't exist, create default settings
      if (error.code === 'PGRST116') {
        console.log('User settings not found, creating defaults');
        await saveUserSettings(defaultSettings);
        return defaultSettings;
      }
      
      console.error('Error fetching settings:', error);
      return defaultSettings;
    }
    
    if (!data) {
      // If no settings found, create default settings
      await saveUserSettings(defaultSettings);
      return defaultSettings;
    }
    
    // Safely merge with defaults to ensure all fields are present
    return {
      account_settings: safelyMergeSettings(defaultSettings.account_settings, data.account_settings),
      privacy_settings: safelyMergeSettings(defaultSettings.privacy_settings, data.privacy_settings),
      match_preferences: safelyMergeSettings(defaultSettings.match_preferences, data.match_preferences),
      communication_settings: safelyMergeSettings(defaultSettings.communication_settings, data.communication_settings),
      ai_companion_settings: safelyMergeSettings(defaultSettings.ai_companion_settings, data.ai_companion_settings),
      accessibility_settings: safelyMergeSettings(defaultSettings.accessibility_settings, data.accessibility_settings),
      security_settings: safelyMergeSettings(defaultSettings.security_settings, data.security_settings),
      app_customization: safelyMergeSettings(defaultSettings.app_customization, data.app_customization)
    };
  } catch (error) {
    console.error('Error in fetchUserSettings:', error);
    return defaultSettings;
  }
};
