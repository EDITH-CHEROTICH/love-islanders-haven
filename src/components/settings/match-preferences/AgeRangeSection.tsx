
import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { MatchPreferences } from '@/services/settings';

interface AgeRangeSectionProps {
  settings: MatchPreferences;
  onSettingsChange: (newSettings: MatchPreferences) => void;
  updateSettings: (settings: MatchPreferences) => Promise<boolean>;
}

const AgeRangeSection = ({ settings, onSettingsChange, updateSettings }: AgeRangeSectionProps) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleAgeRangeChange = async (values: number[]) => {
    if (values.length >= 2) {
      try {
        setIsUpdating(true);
        const newSettings = { 
          ...settings, 
          ageRange: [values[0], values[1]] as [number, number] 
        };
        onSettingsChange(newSettings);
        
        const success = await updateSettings(newSettings);
        if (!success) {
          toast.error('Failed to update age range');
        }
      } catch (error) {
        console.error('Error updating age range:', error);
        toast.error('Failed to update preferences');
      } finally {
        setIsUpdating(false);
      }
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-love">Age Range</h4>
      <div className="py-6 px-2">
        <Slider 
          value={[
            settings.ageRange?.[0] ?? 18, 
            settings.ageRange?.[1] ?? 100
          ]} 
          min={18} 
          max={100} 
          step={1}
          disabled={isUpdating}
          onValueChange={(values) => {
            // Update local state immediately for responsive UI
            onSettingsChange({
              ...settings,
              ageRange: [values[0], values[1]] as [number, number]
            });
          }}
          onValueCommit={handleAgeRangeChange}
          className="mt-6"
        />
        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
          <span>{settings.ageRange?.[0] ?? 18} years</span>
          <span>{settings.ageRange?.[1] ?? 100} years</span>
        </div>
      </div>
    </div>
  );
};

export default AgeRangeSection;
