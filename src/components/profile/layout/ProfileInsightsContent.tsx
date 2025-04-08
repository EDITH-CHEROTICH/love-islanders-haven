
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import ProfileInsights from '@/components/profile/ProfileInsights';

const ProfileInsightsContent = () => {
  return (
    <div className="space-y-6">
      <Alert>
        <AlertTitle>Profile Performance</AlertTitle>
        <AlertDescription>
          See how your profile is performing and get insights on how to improve it.
        </AlertDescription>
      </Alert>
      
      <ProfileInsights />
    </div>
  );
};

export default ProfileInsightsContent;
