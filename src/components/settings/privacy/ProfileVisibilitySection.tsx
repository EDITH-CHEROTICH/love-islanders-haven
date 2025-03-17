
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PrivacySettings } from '@/services/settings';

interface ProfileVisibilitySectionProps {
  settings: PrivacySettings;
  onChange: <K extends keyof PrivacySettings>(key: K, value: PrivacySettings[K]) => void;
}

const ProfileVisibilitySection = ({ settings, onChange }: ProfileVisibilitySectionProps) => {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-love">Profile Visibility</h4>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="profile-visibility" className="cursor-pointer">Who can see your profile?</Label>
          <Select 
            value={settings.profileVisibility ?? 'everyone'}
            onValueChange={(value) => onChange('profileVisibility', value as PrivacySettings['profileVisibility'])}
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
  );
};

export default ProfileVisibilitySection;
