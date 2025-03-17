
import { UserSettings } from './types';

// Initialize settings with default values
export const defaultSettings: UserSettings = {
  account_settings: {},
  privacy_settings: {
    profileVisibility: 'everyone',
    shareLocation: false,
    showDistance: true,
    locationPrecision: 'approximate',
    shareActivityStatus: true,
    lastActiveVisibility: true
  },
  match_preferences: {
    ageRange: [18, 100],
    distance: 50,
    distanceUnit: 'km',
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
