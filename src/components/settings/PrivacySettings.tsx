
import { useState, useEffect } from 'react';
import { Shield, MapPin, UserX, FileText } from 'lucide-react';
import SettingsSection from './SettingsSection';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useSettings } from '@/context/SettingsContext';
import { PrivacySettings as PrivacySettingsType } from '@/services/settings';

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

  const handleExportData = () => {
    toast.success('Your data export has been requested. You will receive an email with your data soon.');
  };

  const handleDeleteAccount = () => {
    toast.error('This feature is not yet implemented.', {
      description: 'Account deletion will be available in a future update.'
    });
  };

  return (
    <SettingsSection title="Privacy Settings" icon={<Shield size={20} />}>
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-love">Profile Visibility</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="profile-visibility" className="cursor-pointer">Who can see your profile?</Label>
              <Select 
                value={localSettings.profileVisibility ?? 'everyone'}
                onValueChange={(value) => handleChange('profileVisibility', value as PrivacySettingsType['profileVisibility'])}
              >
                <SelectTrigger className="w-32 bg-island-light/20 border-island-light">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="everyone">Everyone</SelectItem>
                  <SelectItem value="matches">Matches Only</SelectItem>
                  <SelectItem value="none">No One</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-island-light/30">
          <h4 className="text-sm font-medium text-love">Location Sharing</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-muted-foreground" />
                <Label htmlFor="share-location" className="cursor-pointer">Share your precise location</Label>
              </div>
              <Switch 
                id="share-location" 
                checked={localSettings.shareLocation ?? false}
                onCheckedChange={(checked) => handleChange('shareLocation', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-muted-foreground" />
                <Label htmlFor="show-distance" className="cursor-pointer">Show distance to other users</Label>
              </div>
              <Switch 
                id="show-distance" 
                checked={localSettings.showDistance ?? true}
                onCheckedChange={(checked) => handleChange('showDistance', checked)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-island-light/30">
          <h4 className="text-sm font-medium text-love">Block & Report</h4>
          <Button variant="outline" className="w-full bg-island-light/10 border-island-light/40">
            <UserX size={16} className="mr-2" />
            Manage Blocked Users
          </Button>
        </div>

        <div className="space-y-4 pt-4 border-t border-island-light/30">
          <h4 className="text-sm font-medium text-love">Your Data</h4>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="bg-island-light/10 border-island-light/40" onClick={handleExportData}>
              <FileText size={16} className="mr-2" />
              Export Data
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </SettingsSection>
  );
};

export default PrivacySettings;
