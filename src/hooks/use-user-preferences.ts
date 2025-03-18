
import { useState, useEffect } from 'react';
import { useSettings } from '@/context/SettingsContext';

export const useUserPreferences = () => {
  const { settings } = useSettings();
  const [preferences, setPreferences] = useState<{
    minAge: number;
    maxAge: number;
    maxDistance: number;
    interests: string[];
    dealBreakers: string[];
  }>({
    minAge: 18,
    maxAge: 50,
    maxDistance: 50,
    interests: [],
    dealBreakers: [],
  });

  // Load user preferences from settings
  useEffect(() => {
    if (settings?.match_preferences) {
      const matchPrefs = settings.match_preferences;
      
      setPreferences({
        minAge: matchPrefs.min_age || 18,
        maxAge: matchPrefs.max_age || 50,
        maxDistance: matchPrefs.distance_preference || 50,
        interests: matchPrefs.interests || [],
        dealBreakers: matchPrefs.deal_breakers || [],
      });
    }
  }, [settings]);

  return {
    preferences,
    updatePreferences: setPreferences,
  };
};
