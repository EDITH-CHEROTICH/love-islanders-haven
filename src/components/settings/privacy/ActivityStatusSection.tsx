
import { Activity } from 'lucide-react';
import PrivacyControlsSection from './PrivacyControlsSection';
import PrivacyToggle from './PrivacyToggle';
import { usePrivacy } from './PrivacyContext';

const ActivityStatusSection = () => {
  return (
    <PrivacyControlsSection title="Activity Status" icon={<Activity size={16} className="text-love" />}>
      <PrivacyToggle 
        label="Share your activity status"
        settingKey="shareActivityStatus"
        icon={<Activity size={16} className="text-muted-foreground" />}
      />
      
      <PrivacyToggle 
        label="Show when you were last active"
        settingKey="lastActiveVisibility"
        icon={<Activity size={16} className="text-muted-foreground" />}
      />
    </PrivacyControlsSection>
  );
};

export default ActivityStatusSection;
