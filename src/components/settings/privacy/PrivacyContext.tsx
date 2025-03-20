
import React, { createContext, useContext, useState, useEffect } from 'react';
import { PrivacySettings } from '@/services/settings';
import { useSettings } from '@/context/SettingsContext';

interface PrivacyContextType {
  settings: PrivacySettings;
  updatePrivacySetting: <K extends keyof PrivacySettings>(key: K, value: PrivacySettings[K]) => void;
  isLoading: boolean;
}

const PrivacyContext = createContext<PrivacyContextType | undefined>(undefined);

export const PrivacyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings: globalSettings, updateSettings, isLoading } = useSettings();
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>(
    globalSettings.privacy_settings
  );

  useEffect(() => {
    setPrivacySettings(globalSettings.privacy_settings);
  }, [globalSettings.privacy_settings]);

  const updatePrivacySetting = <K extends keyof PrivacySettings>(
    key: K, 
    value: PrivacySettings[K]
  ) => {
    const newSettings = { ...privacySettings, [key]: value };
    setPrivacySettings(newSettings);
    updateSettings('privacy_settings', newSettings);
  };

  return (
    <PrivacyContext.Provider value={{ 
      settings: privacySettings, 
      updatePrivacySetting,
      isLoading 
    }}>
      {children}
    </PrivacyContext.Provider>
  );
};

export const usePrivacy = () => {
  const context = useContext(PrivacyContext);
  if (context === undefined) {
    throw new Error('usePrivacy must be used within a PrivacyProvider');
  }
  return context;
};
