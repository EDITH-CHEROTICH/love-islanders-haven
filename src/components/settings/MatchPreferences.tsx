
import { Heart } from 'lucide-react';
import SettingsSection from './SettingsSection';
import { useState, useEffect } from 'react';
import { useSettings } from '@/context/SettingsContext';
import { MatchPreferences as MatchPreferencesType } from '@/services/settings';

// Import the component sections
import AgeRangeSection from './match-preferences/AgeRangeSection';
import DistanceSection from './match-preferences/DistanceSection';
import DealBreakersSection from './match-preferences/DealBreakersSection';
import InterestedAgeSection from './match-preferences/InterestedAgeSection';

const MatchPreferences = () => {
  const { settings, updateSettings } = useSettings();
  const [localSettings, setLocalSettings] = useState<MatchPreferencesType>(
    settings.match_preferences
  );

  useEffect(() => {
    setLocalSettings(settings.match_preferences);
  }, [settings.match_preferences]);

  const handleSettingsChange = (newSettings: MatchPreferencesType) => {
    setLocalSettings(newSettings);
  };

  const handleUpdateSettings = async (newSettings: MatchPreferencesType): Promise<boolean> => {
    return await updateSettings('match_preferences', newSettings);
  };
  
  return (
    <SettingsSection title="Match Preferences" icon={<Heart size={20} />}>
      <div className="space-y-6">
        <AgeRangeSection 
          settings={localSettings} 
          onSettingsChange={handleSettingsChange}
          updateSettings={handleUpdateSettings}
        />
        
        <DistanceSection 
          settings={localSettings} 
          onSettingsChange={handleSettingsChange}
          updateSettings={handleUpdateSettings}
        />
        
        <DealBreakersSection 
          settings={localSettings} 
          onSettingsChange={handleSettingsChange}
          updateSettings={handleUpdateSettings}
        />
        
        <InterestedAgeSection 
          settings={localSettings} 
          onSettingsChange={handleSettingsChange}
          updateSettings={handleUpdateSettings}
        />
      </div>
    </SettingsSection>
  );
};

export default MatchPreferences;
