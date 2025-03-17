
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { 
  UserSettings, 
  defaultSettings, 
  fetchUserSettings, 
  updateSettingsCategory,
  saveUserSettings
} from '@/services/settings';
import { useAuth } from '@/context/AuthContext';

interface SettingsContextType {
  settings: UserSettings;
  isLoading: boolean;
  error: string | null;
  updateSettings: <T extends keyof UserSettings>(category: T, newSettings: UserSettings[T]) => Promise<boolean>;
  saveAllSettings: () => Promise<boolean>;
  resetAllSettings: () => Promise<boolean>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load settings when authenticated
  useEffect(() => {
    const loadSettings = async () => {
      if (!isAuthenticated) {
        setSettings(defaultSettings);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const userSettings = await fetchUserSettings();
        setSettings(userSettings);
        setError(null);
      } catch (err) {
        console.error('Failed to load settings:', err);
        setError('Failed to load settings');
        toast.error('Failed to load settings');
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [isAuthenticated]);

  // Update a specific settings category
  const updateSettings = async <T extends keyof UserSettings>(
    category: T, 
    newSettings: UserSettings[T]
  ): Promise<boolean> => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to save settings');
      return false;
    }

    try {
      // Update local state immediately for responsive UI
      setSettings(prev => ({
        ...prev,
        [category]: newSettings
      }));

      // Update in database
      const success = await updateSettingsCategory(category, newSettings);
      
      if (success) {
        console.log(`${category} updated successfully`);
        return true;
      } else {
        // Revert on failure
        const revertedSettings = await fetchUserSettings();
        setSettings(revertedSettings);
        console.error(`Failed to update ${category}`);
        return false;
      }
    } catch (err) {
      console.error(`Error updating ${category}:`, err);
      toast.error(`Failed to update ${category.replace('_', ' ')}`);
      return false;
    }
  };

  // Save all settings at once
  const saveAllSettings = async (): Promise<boolean> => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to save settings');
      return false;
    }

    try {
      const success = await saveUserSettings(settings);
      
      if (success) {
        toast.success('All settings saved successfully');
        return true;
      } else {
        toast.error('Failed to save settings');
        return false;
      }
    } catch (err) {
      console.error('Error saving all settings:', err);
      toast.error('Failed to save settings');
      return false;
    }
  };

  // Reset all settings to default
  const resetAllSettings = async (): Promise<boolean> => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to reset settings');
      return false;
    }

    try {
      setSettings(defaultSettings);
      const success = await saveUserSettings(defaultSettings);
      
      if (success) {
        toast.success('All settings reset to default');
        return true;
      } else {
        // Revert on failure
        const revertedSettings = await fetchUserSettings();
        setSettings(revertedSettings);
        toast.error('Failed to reset settings');
        return false;
      }
    } catch (err) {
      console.error('Error resetting settings:', err);
      toast.error('Failed to reset settings');
      return false;
    }
  };

  return (
    <SettingsContext.Provider value={{ 
      settings, 
      isLoading, 
      error, 
      updateSettings, 
      saveAllSettings,
      resetAllSettings 
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
