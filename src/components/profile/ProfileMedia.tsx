
import ProfileMediaSection from './ProfileMediaSection';
import { Profile } from '@/utils/dummyData';

interface ProfileMediaProps {
  profile: Profile;
  visibleImagesIndices?: number[];
}

const ProfileMedia = ({ profile, visibleImagesIndices }: ProfileMediaProps) => {
  return (
    <div className="space-y-4">
      <ProfileMediaSection 
        profile={profile} 
        visibleImagesIndices={visibleImagesIndices}
      />
    </div>
  );
};

export default ProfileMedia;
