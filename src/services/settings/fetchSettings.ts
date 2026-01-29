
import { supabase } from "@/integrations/supabase/client";
import { UserSettings } from "./types";
import { defaultSettings } from "./defaults";
import { safelyMergeSettings } from "./utils";
import { saveUserSettings } from "./saveSettings";

// Fetch user settings from Supabase
export const fetchUserSettings = async (): Promise<UserSettings> => {
  try {
    console.log('Fetching user settings');
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      throw new Error('Not authenticated');
    }
    
    const userId = userData.user.id;
    console.log('UserId:', userId);
    
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
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
      console.log('No settings data returned, creating defaults');
      await saveUserSettings(defaultSettings);
      return defaultSettings;
    }
    
    console.log('Retrieved settings:', data);
    
    // Map basic settings to our structure
    return {
      account_settings: {
        ...defaultSettings.account_settings,
        theme: (data.theme as 'light' | 'dark' | 'system') || 'system'
      },
      privacy_settings: {
        ...defaultSettings.privacy_settings,
        show_online_status: data.show_online_status ?? true,
        location_sharing: data.location_sharing ?? false
      },
      match_preferences: defaultSettings.match_preferences,
      communication_settings: {
        ...defaultSettings.communication_settings,
        notifications_enabled: data.notifications_enabled ?? true
      },
      ai_companion_settings: defaultSettings.ai_companion_settings,
      accessibility_settings: defaultSettings.accessibility_settings,
      security_settings: defaultSettings.security_settings,
      app_customization: defaultSettings.app_customization
    };
  } catch (error) {
    console.error('Error in fetchUserSettings:', error);
    return defaultSettings;
  }
};
