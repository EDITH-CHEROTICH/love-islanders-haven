
import { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import SettingsSection from './SettingsSection';
import { useSettings } from '@/context/SettingsContext';
import { PrivacySettings as PrivacySettingsType } from '@/services/settings';

// Import the new component sections
import ProfileVisibilitySection from './privacy/ProfileVisibilitySection';
import LocationSharingSection from './privacy/LocationSharingSection';
import ActivityStatusSection from './privacy/ActivityStatusSection';
import BlockReportSection from './privacy/BlockReportSection';
import DataManagementSection from './privacy/DataManagementSection';

const PrivacySettings = () => {
  const { settings, updateSettings } = useSettings();
  const [localSettings, setLocalSettings] = useState<PrivacySettingsType>(
    settings.privacy_settings
  );

  useEffect(() => {
    setLocalSettings(settings.privacy_settings);
  }, [settings.privacy_settings]);

  const handleChange = <K extends keyof PrivacySettingsType>(
    key: K, 
    value: PrivacySettingsType[K]
  ) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    updateSettings('privacy_settings', newSettings);
  };

  return (
    <SettingsSection title="Privacy Settings" icon={<Shield size={20} />}>
      <div className="space-y-6">
        <ProfileVisibilitySection 
          settings={localSettings} 
          onChange={handleChange} 
        />
        
        <LocationSharingSection 
          settings={localSettings} 
          onChange={handleChange} 
        />
        
        <ActivityStatusSection 
          settings={localSettings} 
          onChange={handleChange} 
        />
        
        <BlockReportSection />
        
        <DataManagementSection />
      </div>
    </SettingsSection>
  );
};

export default PrivacySettings;
