
import ProfileMediaSection from './ProfileMediaSection';
import { Profile } from '@/utils/dummyData';

interface ProfileMediaProps {
  profile: Profile;
  visibleImagesIndices?: number[];
  isMyProfile?: boolean;
}

const ProfileMedia = ({ profile, visibleImagesIndices, isMyProfile = false }: ProfileMediaProps) => {
  return (
    <div className="space-y-4">
      <ProfileMediaSection 
        profile={profile} 
        visibleImagesIndices={visibleImagesIndices}
        isMyProfile={isMyProfile}
      />
    </div>
  );
};

export default ProfileMedia;
