
import { Json } from "@/integrations/supabase/types";

// Types for all settings categories
export interface AccountSettings {
  email?: string;
}

export interface PrivacySettings {
  profileVisibility?: 'everyone' | 'matches' | 'none';
  shareLocation?: boolean;
  showDistance?: boolean;
  locationPrecision?: 'exact' | 'approximate' | 'city';
  shareActivityStatus?: boolean;
  lastActiveVisibility?: boolean;
}

export interface MatchPreferences {
  ageRange?: [number, number];
  interestedAge?: [number, number]; // Add the new field
  distance?: number;
  distanceUnit?: 'km' | 'mi';
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
