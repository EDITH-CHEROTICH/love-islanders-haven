
import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { MatchPreferences } from '@/services/settings';

interface InterestedAgeSectionProps {
  settings: MatchPreferences;
  onSettingsChange: (newSettings: MatchPreferences) => void;
  updateSettings: (settings: MatchPreferences) => Promise<boolean>;
}

const InterestedAgeSection = ({ settings, onSettingsChange, updateSettings }: InterestedAgeSectionProps) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleInterestedAgeChange = async (values: number[]) => {
    if (values.length >= 2) {
      try {
        setIsUpdating(true);
        const newSettings = { 
          ...settings, 
          interestedAge: [values[0], values[1]] as [number, number] 
        };
        onSettingsChange(newSettings);
        
        const success = await updateSettings(newSettings);
        if (!success) {
          toast.error('Failed to update interested age range');
        }
      } catch (error) {
        console.error('Error updating interested age range:', error);
        toast.error('Failed to update preferences');
      } finally {
        setIsUpdating(false);
      }
    }
  };

  return (
    <div className="space-y-4 pt-4 border-t border-island-light/30">
      <h4 className="text-sm font-medium text-love">Interested Age Range</h4>
      <div className="py-6 px-2">
        <Slider 
          value={[
            settings.interestedAge?.[0] ?? 25, 
            settings.interestedAge?.[1] ?? 35
          ]} 
          min={18} 
          max={100} 
          step={1}
          disabled={isUpdating}
          onValueChange={(values) => {
            // Update local state immediately for responsive UI
            onSettingsChange({
              ...settings,
              interestedAge: [values[0], values[1]] as [number, number]
            });
          }}
          onValueCommit={handleInterestedAgeChange}
          className="mt-6"
        />
        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
          <span>{settings.interestedAge?.[0] ?? 25} years</span>
          <span>{settings.interestedAge?.[1] ?? 35} years</span>
        </div>
      </div>
    </div>
  );
};

export default InterestedAgeSection;
