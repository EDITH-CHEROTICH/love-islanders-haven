
import { supabase } from "@/integrations/supabase/client";

// Types for all settings categories
export interface AccountSettings {
  email?: string;
}

export interface PrivacySettings {
  profileVisibility?: 'everyone' | 'matches' | 'none';
  shareLocation?: boolean;
  showDistance?: boolean;
}

export interface MatchPreferences {
  ageRange?: [number, number];
  distance?: number;
  dealBreakers?: {
    smoking?: boolean;
    children?: boolean;
    pets?: boolean;
  };
}

export interface CommunicationSettings {
  readReceipts?: boolean;
  typingIndicators?: boolean;
  filterOffensive?: boolean;
  filterSpam?: boolean;
}

export interface AICompanionSettings {
  conversationStyle?: 'playful' | 'caring' | 'thoughtful' | 'flirty';
  voiceTone?: 'warm' | 'soft' | 'confident' | 'soothing';
  allowProactiveMessages?: boolean;
  messageFrequency?: number;
}

export interface AccessibilitySettings {
  textSize?: number;
  highContrast?: boolean;
  colorBlindness?: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  screenReader?: boolean;
  voiceCommands?: boolean;
}

export interface SecuritySettings {
  twoFactor?: boolean;
  biometric?: boolean;
  loginNotification?: boolean;
}

export interface AppCustomization {
  theme?: 'light' | 'dark' | 'system';
  autoTheme?: boolean;
  language?: string;
  soundEffects?: boolean;
  hapticFeedback?: boolean;
  animations?: boolean;
}

export interface UserSettings {
  account_settings: AccountSettings;
  privacy_settings: PrivacySettings;
  match_preferences: MatchPreferences;
  communication_settings: CommunicationSettings;
  ai_companion_settings: AICompanionSettings;
  accessibility_settings: AccessibilitySettings;
  security_settings: SecuritySettings;
  app_customization: AppCustomization;
}

// Initialize settings with default values
export const defaultSettings: UserSettings = {
  account_settings: {},
  privacy_settings: {
    profileVisibility: 'everyone',
    shareLocation: false,
    showDistance: true
  },
  match_preferences: {
    ageRange: [18, 40],
    distance: 50,
    dealBreakers: {
      smoking: false,
      children: false,
      pets: false
    }
  },
  communication_settings: {
    readReceipts: true,
    typingIndicators: true,
    filterOffensive: true,
    filterSpam: true
  },
  ai_companion_settings: {
    conversationStyle: 'caring',
    voiceTone: 'warm',
    allowProactiveMessages: true,
    messageFrequency: 3
  },
  accessibility_settings: {
    textSize: 2,
    highContrast: false,
    colorBlindness: 'none',
    screenReader: false,
    voiceCommands: false
  },
  security_settings: {
    twoFactor: false,
    biometric: false,
    loginNotification: true
  },
  app_customization: {
    theme: 'dark',
    autoTheme: false,
    language: 'en',
    soundEffects: true,
    hapticFeedback: true,
    animations: true
  }
};

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
      account_settings: { ...defaultSettings.account_settings, ...(data.account_settings || {}) },
      privacy_settings: { ...defaultSettings.privacy_settings, ...(data.privacy_settings || {}) },
      match_preferences: { ...defaultSettings.match_preferences, ...(data.match_preferences || {}) },
      communication_settings: { ...defaultSettings.communication_settings, ...(data.communication_settings || {}) },
      ai_companion_settings: { ...defaultSettings.ai_companion_settings, ...(data.ai_companion_settings || {}) },
      accessibility_settings: { ...defaultSettings.accessibility_settings, ...(data.accessibility_settings || {}) },
      security_settings: { ...defaultSettings.security_settings, ...(data.security_settings || {}) },
      app_customization: { ...defaultSettings.app_customization, ...(data.app_customization || {}) }
    };
  } catch (error) {
    console.error('Error in fetchUserSettings:', error);
    return defaultSettings;
  }
};

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
        [category]: settings,
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
        account_settings: settings.account_settings,
        privacy_settings: settings.privacy_settings,
        match_preferences: settings.match_preferences,
        communication_settings: settings.communication_settings,
        ai_companion_settings: settings.ai_companion_settings,
        accessibility_settings: settings.accessibility_settings,
        security_settings: settings.security_settings,
        app_customization: settings.app_customization,
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
