
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
        minAge: matchPrefs.ageRange?.[0] || 18,
        maxAge: matchPrefs.ageRange?.[1] || 50,
        maxDistance: matchPrefs.distance || 50,
        interests: matchPrefs.interestedAge ? [] : [], // No interests field in current type
        dealBreakers: Object.entries(matchPrefs.dealBreakers || {})
          .filter(([_, value]) => value === true)
          .map(([key]) => key),
      });
    }
  }, [settings]);

  return {
    preferences,
    updatePreferences: setPreferences,
  };
};
