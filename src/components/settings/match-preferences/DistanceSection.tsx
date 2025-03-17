
import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { MatchPreferences } from '@/services/settings';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

// Conversion helpers
const kmToMiles = (km: number) => Math.round(km * 0.621371);
const milesToKm = (miles: number) => Math.round(miles / 0.621371);

interface DistanceSectionProps {
  settings: MatchPreferences;
  onSettingsChange: (newSettings: MatchPreferences) => void;
  updateSettings: (settings: MatchPreferences) => Promise<boolean>;
}

const DistanceSection = ({ settings, onSettingsChange, updateSettings }: DistanceSectionProps) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleDistanceChange = async (values: number[]) => {
    if (values.length > 0) {
      try {
        setIsUpdating(true);
        // Always store distance in km in the database
        let distanceValue = values[0];
        if (settings.distanceUnit === 'mi') {
          distanceValue = milesToKm(distanceValue);
        }
        
        const newSettings = { 
          ...settings, 
          distance: distanceValue 
        };
        onSettingsChange({
          ...settings,
          distance: distanceValue
        });
        
        const success = await updateSettings(newSettings);
        if (!success) {
          toast.error('Failed to update distance');
        }
      } catch (error) {
        console.error('Error updating distance:', error);
        toast.error('Failed to update preferences');
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleDistanceUnitChange = async (value: 'km' | 'mi') => {
    try {
      setIsUpdating(true);
      const newSettings = { 
        ...settings, 
        distanceUnit: value 
      };
      onSettingsChange(newSettings);
      
      const success = await updateSettings(newSettings);
      if (!success) {
        toast.error('Failed to update distance unit');
      }
    } catch (error) {
      console.error('Error updating distance unit:', error);
      toast.error('Failed to update preferences');
    } finally {
      setIsUpdating(false);
    }
  };

  // Get the display distance based on the selected unit
  const getDisplayDistance = () => {
    const distance = settings.distance ?? 50;
    if (settings.distanceUnit === 'mi') {
      return kmToMiles(distance);
    }
    return distance;
  };

  // Get the max slider value based on unit
  const getMaxDistance = () => {
    return settings.distanceUnit === 'mi' ? 100 : 160;
  };

  return (
    <div className="space-y-4 pt-4 border-t border-island-light/30">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium text-love">Distance</h4>
        <Select 
          value={settings.distanceUnit ?? 'km'} 
          onValueChange={(value: 'km' | 'mi') => handleDistanceUnitChange(value)}
          disabled={isUpdating}
        >
          <SelectTrigger className="w-24 h-8">
            <SelectValue placeholder="Unit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="km">Kilometers</SelectItem>
            <SelectItem value="mi">Miles</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="py-6 px-2">
        <Slider 
          value={[getDisplayDistance()]} 
          min={1} 
          max={getMaxDistance()} 
          step={1}
          disabled={isUpdating}
          onValueChange={(values) => {
            // Update local state immediately for responsive UI
            onSettingsChange({
              ...settings,
              // Don't convert here, just update display value
              distance: settings.distanceUnit === 'mi' 
                ? milesToKm(values[0]) 
                : values[0]
            });
          }}
          onValueCommit={handleDistanceChange}
          className="mt-6"
        />
        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
          <span>1 {settings.distanceUnit ?? 'km'}</span>
          <span>{getDisplayDistance()} {settings.distanceUnit ?? 'km'}</span>
        </div>
      </div>
    </div>
  );
};

export default DistanceSection;
