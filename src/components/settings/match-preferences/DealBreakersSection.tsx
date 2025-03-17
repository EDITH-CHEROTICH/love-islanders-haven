
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { MatchPreferences } from '@/services/settings';

interface DealBreakersSectionProps {
  settings: MatchPreferences;
  onSettingsChange: (newSettings: MatchPreferences) => void;
  updateSettings: (settings: MatchPreferences) => Promise<boolean>;
}

const DealBreakersSection = ({ settings, onSettingsChange, updateSettings }: DealBreakersSectionProps) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleDealBreakerChange = async (key: keyof MatchPreferences['dealBreakers'], checked: boolean) => {
    try {
      setIsUpdating(true);
      // Create a deep copy of the current settings to avoid mutation issues
      const dealBreakers = { 
        ...settings.dealBreakers,
        [key]: checked
      };
      
      // Create a new settings object with the updated deal breakers
      const newSettings = { 
        ...settings, 
        dealBreakers
      };
      
      // Update local state first for responsive UI
      onSettingsChange(newSettings);
      
      // Persist to database
      console.log(`Updating deal breaker ${key} to ${checked}`, newSettings);
      const success = await updateSettings(newSettings);
      if (!success) {
        toast.error(`Failed to update ${key} preference`);
      }
    } catch (error) {
      console.error('Error updating deal breakers:', error);
      toast.error('Failed to update preferences');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-4 pt-4 border-t border-island-light/30">
      <h4 className="text-sm font-medium text-love">Deal-breakers</h4>
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="smoking" 
            checked={!!settings.dealBreakers?.smoking}
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
            checked={!!settings.dealBreakers?.children}
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
            checked={!!settings.dealBreakers?.pets}
            disabled={isUpdating}
            onCheckedChange={(checked) => 
              handleDealBreakerChange('pets', checked === true)
            }
          />
          <Label htmlFor="pets">Has pets</Label>
        </div>
      </div>
    </div>
  );
};

export default DealBreakersSection;
