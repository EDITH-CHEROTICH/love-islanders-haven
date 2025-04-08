
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import ProfileMedia from '@/components/profile/ProfileMedia';
import ProfileDetails from '@/components/profile/ProfileDetails';
import ProfileActionBar from '@/components/profile/ProfileActionBar';
import { Profile } from '@/utils/dummyData';

interface ProfileViewContentProps {
  profile: Profile;
  onEdit: () => void;
}

const ProfileViewContent = ({ profile, onEdit }: ProfileViewContentProps) => {
  return (
    <div className="space-y-6">
      {profile.images && profile.images.length > 0 ? (
        <ProfileMedia 
          profile={profile} 
          isMyProfile={true} 
        />
      ) : (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No profile images</AlertTitle>
          <AlertDescription>
            Click "Edit" to add profile images.
          </AlertDescription>
        </Alert>
      )}
      
      <ProfileDetails profile={profile} />
      
      <ProfileActionBar onEdit={onEdit} />
    </div>
  );
};

export default ProfileViewContent;
