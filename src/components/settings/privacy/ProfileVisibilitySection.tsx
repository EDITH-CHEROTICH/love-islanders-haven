
import { Eye } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import PrivacyControlsSection from './PrivacyControlsSection';
import { usePrivacy } from './PrivacyContext';

const ProfileVisibilitySection = () => {
  const { settings, updatePrivacySetting } = usePrivacy();
  
  return (
    <PrivacyControlsSection title="Profile Visibility" icon={<Eye size={16} className="text-love" />}>
      <div className="flex items-center justify-between">
        <Label htmlFor="profile-visibility" className="cursor-pointer">Who can see your profile?</Label>
        <Select 
          value={settings.profileVisibility ?? 'everyone'}
          onValueChange={(value) => updatePrivacySetting('profileVisibility', value as any)}
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
    </PrivacyControlsSection>
  );
};

export default ProfileVisibilitySection;
