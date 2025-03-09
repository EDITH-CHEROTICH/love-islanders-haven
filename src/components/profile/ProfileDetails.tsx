
import { Heart, User, Users, ShieldCheck } from 'lucide-react';
import { Profile } from '../../utils/dummyData';

interface ProfileDetailsProps {
  profile: Profile;
}

const ProfileDetails = ({ profile }: ProfileDetailsProps) => {
  const getGoalDisplayText = (goal?: 'long-term' | 'casual' | 'both') => {
    switch (goal) {
      case 'long-term':
        return 'Life-time Partner';
      case 'casual':
        return 'Casual Fun';
      case 'both':
        return 'Open to Both';
      default:
        return 'Not Specified';
    }
  };

  const getGenderPreferenceText = (preference?: 'male' | 'female' | 'both') => {
    switch (preference) {
      case 'male':
        return 'men';
      case 'female':
        return 'women';
      case 'both':
        return 'everyone';
      default:
        return 'not specified';
    }
  };

  const getGenderIcon = (gender?: 'male' | 'female' | 'both' | 'other') => {
    switch (gender) {
      case 'male':
        return <User size={16} className="text-blue-400" />;
      case 'female':
        return <User size={16} className="text-pink-400" />;
      case 'both':
      case 'other':
      default:
        return <Users size={16} className="text-purple-400" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-white">{profile.name}, {profile.age}</h1>
        {profile.verified && (
          <ShieldCheck size={20} className="text-green-400 ml-2" />
        )}
      </div>
      <p className="text-muted-foreground">{profile.location}</p>
      
      <div className="flex flex-wrap gap-2">
        {profile.relationshipGoal && (
          <div className="flex items-center gap-1 bg-love/10 text-love-light px-3 py-1 rounded-full text-sm">
            <Heart size={16} />
            <span>{getGoalDisplayText(profile.relationshipGoal)}</span>
          </div>
        )}
        {profile.gender && (
          <div className="flex items-center gap-1 bg-blue-500/10 text-blue-300 px-3 py-1 rounded-full text-sm">
            {getGenderIcon(profile.gender)}
            <span>{profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1)}</span>
          </div>
        )}
        {profile.genderPreference && (
          <div className="flex items-center gap-1 bg-purple-500/10 text-purple-300 px-3 py-1 rounded-full text-sm">
            {getGenderIcon(profile.genderPreference)}
            <span>Interested in {getGenderPreferenceText(profile.genderPreference)}</span>
          </div>
        )}
      </div>
      
      <div>
        <h2 className="text-sm font-medium text-love mb-2">About</h2>
        <p className="text-muted-foreground">{profile.bio}</p>
      </div>
      
      <div>
        <h2 className="text-sm font-medium text-love mb-2">Interests</h2>
        <div className="flex flex-wrap gap-2">
          {profile.interests.map((interest, i) => (
            <span 
              key={i} 
              className="bg-love/10 text-love-light px-3 py-1 rounded-full text-sm"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
