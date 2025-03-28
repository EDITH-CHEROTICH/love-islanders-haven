
import { Shield } from 'lucide-react';
import SettingsSection from './SettingsSection';
import { PrivacyProvider } from './privacy/PrivacyContext';

// Import the components using the index file
import {
  ProfileVisibilitySection,
  LocationSharingSection,
  ActivityStatusSection,
  BlockReportSection
} from './privacy';

const PrivacySettings = () => {
  return (
    <SettingsSection title="Privacy Settings" icon={<Shield size={20} />}>
      <PrivacyProvider>
        <div className="space-y-6">
          <ProfileVisibilitySection />
          <LocationSharingSection />
          <ActivityStatusSection />
          <BlockReportSection />
        </div>
      </PrivacyProvider>
    </SettingsSection>
  );
};

export default PrivacySettings;
