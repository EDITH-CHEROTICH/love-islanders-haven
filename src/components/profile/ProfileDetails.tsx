
import { CircleCheck } from 'lucide-react';
import { Profile } from '../../utils/dummyData';

interface ProfileDetailsProps {
  profile: Profile;
}

const ProfileDetails = ({ profile }: ProfileDetailsProps) => {
  const getAgeDisplay = () => {
    if (!profile.showAge && profile.age) {
      return 'Age hidden';
    } else if (profile.age) {
      return `${profile.age}`;
    }
    return '';
  };
  
  const getRelationshipGoalText = () => {
    switch(profile.relationshipGoal) {
      case 'long-term':
        return 'Looking for a serious relationship';
      case 'casual':
        return 'Looking for something casual';
      case 'both':
        return 'Open to different relationship types';
      default:
        return '';
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-bold">{profile.name}</h2>
        {getAgeDisplay() && <span className="text-xl">{getAgeDisplay()}</span>}
        
        {profile.verified && (
          <span className="ml-1 text-love flex items-center" title="Verified Profile">
            <CircleCheck size={20} className="fill-love text-island-dark" />
          </span>
        )}
      </div>
      
      {profile.bio && (
        <p className="text-sm text-white/90">{profile.bio}</p>
      )}
      
      <div className="flex flex-wrap gap-2">
        {profile.occupation && (
          <span className="text-xs bg-island-light/20 text-white px-2 py-1 rounded-full">
            {profile.occupation}
          </span>
        )}
        
        {profile.education && (
          <span className="text-xs bg-island-light/20 text-white px-2 py-1 rounded-full">
            {profile.education}
          </span>
        )}
        
        {getRelationshipGoalText() && (
          <span className="text-xs bg-love/20 text-love px-2 py-1 rounded-full">
            {getRelationshipGoalText()}
          </span>
        )}
      </div>
    </div>
  );
};

export default ProfileDetails;
