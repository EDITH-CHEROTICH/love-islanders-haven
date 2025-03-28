
import { MapPin } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import PrivacyControlsSection from './PrivacyControlsSection';
import PrivacyToggle from './PrivacyToggle';
import { usePrivacy } from './PrivacyContext';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { requestAndUpdateLocation } from '@/services/profiles/location';
import { toast } from 'sonner';

const LocationSharingSection = () => {
  const { settings, updatePrivacySetting } = usePrivacy();
  const [isUpdatingLocation, setIsUpdatingLocation] = useState(false);
  
  const handleUpdateLocation = async () => {
    try {
      setIsUpdatingLocation(true);
      const success = await requestAndUpdateLocation();
      
      if (success) {
        // If location toggle is off, turn it on since the user is explicitly sharing location
        if (!settings.shareLocation) {
          updatePrivacySetting('shareLocation', true);
        }
        toast.success('Your location has been updated successfully');
      }
    } catch (error) {
      console.error('Error updating location:', error);
      toast.error('Failed to update your location');
    } finally {
      setIsUpdatingLocation(false);
    }
  };
  
  return (
    <PrivacyControlsSection title="Location Sharing" icon={<MapPin size={16} className="text-love" />}>
      <PrivacyToggle 
        label="Share your location"
        settingKey="shareLocation"
        icon={<MapPin size={16} className="text-muted-foreground" />}
        description="Allow the app to use your location for distance calculation and matching"
        onChange={async (checked) => {
          // If turning on, prompt to update location
          if (checked) {
            return handleUpdateLocation();
          }
          return Promise.resolve();
        }}
      />
      
      <PrivacyToggle 
        label="Show distance to other users"
        settingKey="showDistance"
        icon={<MapPin size={16} className="text-muted-foreground" />}
        description="Display how far away other users are from your location"
      />
      
      <div className="flex items-center justify-between">
        <Label htmlFor="location-precision" className="cursor-pointer">Location precision</Label>
        <Select 
          value={settings.locationPrecision ?? 'approximate'}
          onValueChange={(value) => updatePrivacySetting('locationPrecision', value as any)}
        >
          <SelectTrigger className="w-32 bg-island-light/20 border-island-light">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="exact">Exact</SelectItem>
            <SelectItem value="approximate">Approximate</SelectItem>
            <SelectItem value="city">City only</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button 
        onClick={handleUpdateLocation} 
        variant="outline" 
        size="sm" 
        className="w-full mt-2"
        disabled={isUpdatingLocation}
      >
        {isUpdatingLocation ? 'Updating Location...' : 'Update My Location Now'}
      </Button>
    </PrivacyControlsSection>
  );
};

export default LocationSharingSection;
