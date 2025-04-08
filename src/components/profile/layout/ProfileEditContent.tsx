
import { Button } from '@/components/ui/button';
import ProfileImageManager from '@/components/profile/ProfileImageManager';
import ProfileDisplayPreferences from '@/components/profile/ProfileDisplayPreferences';
import { Profile } from '@/utils/dummyData';

interface ProfileEditContentProps {
  profile: Profile;
  onDoneEditing: () => void;
  onImagesChange: (images: string[]) => void;
  onVerificationSuccess: () => void;
  onPreferencesUpdated: () => void;
}

const ProfileEditContent = ({
  profile,
  onDoneEditing,
  onImagesChange,
  onVerificationSuccess,
  onPreferencesUpdated
}: ProfileEditContentProps) => {
  return (
    <div className="space-y-8">
      <div className="p-4 bg-island-light/10 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
        
        <div className="space-y-8">
          <ProfileImageManager 
            images={profile.images || []}
            verified={profile.verified || false}
            onImagesChange={onImagesChange}
            onVerificationRequest={onVerificationSuccess}
          />
          
          <ProfileDisplayPreferences 
            initialDisplayName={profile.name}
            initialShowAge={profile.showAge !== undefined ? profile.showAge : true}
            onPreferencesUpdated={onPreferencesUpdated}
          />
        </div>
      </div>
      
      <Button 
        onClick={onDoneEditing}
        className="w-full"
        variant="outline"
      >
        Done Editing
      </Button>
    </div>
  );
};

export default ProfileEditContent;
