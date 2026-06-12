
import { Profile } from '../../utils/dummyData';
import ProfileDetails from './ProfileDetails';
import ProfileMedia from './ProfileMedia';

interface ProfileViewModeProps {
  profile: Profile;
}

const ProfileViewMode = ({ profile }: ProfileViewModeProps) => {
  const primaryImage = profile.images?.[0];
  return (
    <>
      <div className="aspect-square overflow-hidden rounded-xl mb-4 bg-island-light/20 flex items-center justify-center">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={profile.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-muted-foreground text-sm">No photo yet</span>
        )}
      </div>

      <ProfileDetails profile={profile} />

      <ProfileMedia profile={profile} />
    </>
  );
};

export default ProfileViewMode;
