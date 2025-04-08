
import { Profile } from '../../utils/dummyData';
import ProfileDetails from './ProfileDetails';
import ProfileMedia from './ProfileMedia';

interface ProfileViewModeProps {
  profile: Profile;
}

const ProfileViewMode = ({ profile }: ProfileViewModeProps) => {
  return (
    <>
      <div className="aspect-square overflow-hidden rounded-xl mb-4">
        <img 
          src={profile.images[0]} 
          alt={profile.name} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <ProfileDetails profile={profile} />
      
      <ProfileMedia profile={profile} />
    </>
  );
};

export default ProfileViewMode;
