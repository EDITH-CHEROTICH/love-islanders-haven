
import { Heart } from 'lucide-react';
import SettingsSection from './SettingsSection';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useState, useEffect } from 'react';
import { useSettings } from '@/context/SettingsContext';
import { MatchPreferences as MatchPreferencesType } from '@/services/settings';
import { toast } from 'sonner';

const MatchPreferences = () => {
  const { settings, updateSettings } = useSettings();
  const [localSettings, setLocalSettings] = useState<MatchPreferencesType>(
    settings.match_preferences
  );
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setLocalSettings(settings.match_preferences);
  }, [settings.match_preferences]);

  const handleAgeRangeChange = async (values: number[]) => {
    if (values.length >= 2) {
      try {
        setIsUpdating(true);
        const newSettings = { 
          ...localSettings, 
          ageRange: [values[0], values[1]] as [number, number] 
        };
        setLocalSettings(newSettings);
        
        const success = await updateSettings('match_preferences', newSettings);
        if (!success) {
          toast.error('Failed to update age range preferences');
        }
      } catch (error) {
        console.error('Error updating age range:', error);
        toast.error('Failed to update preferences');
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleDistanceChange = async (values: number[]) => {
    try {
      setIsUpdating(true);
      const newSettings = { ...localSettings, distance: values[0] };
      setLocalSettings(newSettings);
      
      const success = await updateSettings('match_preferences', newSettings);
      if (!success) {
        toast.error('Failed to update distance preferences');
      }
    } catch (error) {
      console.error('Error updating distance:', error);
      toast.error('Failed to update preferences');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDealBreakerChange = async (key: keyof MatchPreferencesType['dealBreakers'], checked: boolean) => {
    try {
      setIsUpdating(true);
      const dealBreakers = localSettings.dealBreakers || {};
      
      const newDealBreakers = { 
        ...dealBreakers,
        [key]: checked
      };
      
      const newSettings = { 
        ...localSettings, 
        dealBreakers: newDealBreakers 
      };
      
      setLocalSettings(newSettings);
      
      const success = await updateSettings('match_preferences', newSettings);
      if (!success) {
        toast.error('Failed to update deal breaker preferences');
      }
    } catch (error) {
      console.error('Error updating deal breakers:', error);
      toast.error('Failed to update preferences');
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <SettingsSection title="Match Preferences" icon={<Heart size={20} />}>
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-love">Age Range</h4>
          <div className="py-6 px-2">
            <Slider 
              value={[
                localSettings.ageRange?.[0] ?? 18, 
                localSettings.ageRange?.[1] ?? 40
              ]} 
              min={18} 
              max={100} 
              step={1}
              disabled={isUpdating}
              onValueCommit={handleAgeRangeChange}
              className="mt-6"
            />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>{localSettings.ageRange?.[0] ?? 18} years</span>
              <span>{localSettings.ageRange?.[1] ?? 40} years</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-island-light/30">
          <h4 className="text-sm font-medium text-love">Distance</h4>
          <div className="py-6 px-2">
            <Slider 
              value={[localSettings.distance ?? 50]} 
              min={1} 
              max={100} 
              step={1}
              disabled={isUpdating}
              onValueCommit={handleDistanceChange}
              className="mt-6"
            />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>1 km</span>
              <span>{localSettings.distance ?? 50} km</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-island-light/30">
          <h4 className="text-sm font-medium text-love">Deal-breakers</h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="smoking" 
                checked={localSettings.dealBreakers?.smoking ?? false}
                disabled={isUpdating}
                onCheckedChange={(checked) => 
                  handleDealBreakerChange('smoking', checked === true)
                }
              />
              <Label htmlFor="smoking">Smoking</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="children" 
                checked={localSettings.dealBreakers?.children ?? false}
                disabled={isUpdating}
                onCheckedChange={(checked) => 
                  handleDealBreakerChange('children', checked === true)
                }
              />
              <Label htmlFor="children">Has children</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="pets" 
                checked={localSettings.dealBreakers?.pets ?? false}
                disabled={isUpdating}
                onCheckedChange={(checked) => 
                  handleDealBreakerChange('pets', checked === true)
                }
              />
              <Label htmlFor="pets">Has pets</Label>
            </div>
          </div>
        </div>
      </div>
    </SettingsSection>
  );
};

export default MatchPreferences;
