
import { MapPin } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import PrivacyControlsSection, { PrivacyToggle } from './PrivacyControlsSection';
import { usePrivacy } from './PrivacyContext';

const LocationSharingSection = () => {
  const { settings, updatePrivacySetting } = usePrivacy();
  
  return (
    <PrivacyControlsSection title="Location Sharing" icon={<MapPin size={16} className="text-love" />}>
      <PrivacyToggle 
        label="Share your location"
        settingKey="shareLocation"
        icon={<MapPin size={16} className="text-muted-foreground" />}
      />
      
      <PrivacyToggle 
        label="Show distance to other users"
        settingKey="showDistance"
        icon={<MapPin size={16} className="text-muted-foreground" />}
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
    </PrivacyControlsSection>
  );
};

export default LocationSharingSection;
