
import ProfileViewContainer from './profile/ProfileViewContainer';
import { Profile } from '../utils/dummyData';

interface ProfileViewProps {
  profile: Profile;
  isEditable?: boolean;
}

const ProfileView = ({ profile, isEditable = false }: ProfileViewProps) => {
  return <ProfileViewContainer profile={profile} isEditable={isEditable} />;
};

export default ProfileView;
