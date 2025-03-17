
import { MapPin } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PrivacySettings } from '@/services/settings';

interface LocationSharingSectionProps {
  settings: PrivacySettings;
  onChange: <K extends keyof PrivacySettings>(key: K, value: PrivacySettings[K]) => void;
}

const LocationSharingSection = ({ settings, onChange }: LocationSharingSectionProps) => {
  return (
    <div className="space-y-4 pt-4 border-t border-island-light/30">
      <h4 className="text-sm font-medium text-love">Location Sharing</h4>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-muted-foreground" />
            <Label htmlFor="share-location" className="cursor-pointer">Share your location</Label>
          </div>
          <Switch 
            id="share-location" 
            checked={settings.shareLocation ?? false}
            onCheckedChange={(checked) => onChange('shareLocation', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-muted-foreground" />
            <Label htmlFor="show-distance" className="cursor-pointer">Show distance to other users</Label>
          </div>
          <Switch 
            id="show-distance" 
            checked={settings.showDistance ?? true}
            onCheckedChange={(checked) => onChange('showDistance', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="location-precision" className="cursor-pointer">Location precision</Label>
          <Select 
            value={settings.locationPrecision ?? 'approximate'}
            onValueChange={(value) => onChange('locationPrecision', value as PrivacySettings['locationPrecision'])}
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
      </div>
    </div>
  );
};

export default LocationSharingSection;
