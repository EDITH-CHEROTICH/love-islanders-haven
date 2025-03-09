
import { Heart, User, Users, ShieldCheck, Briefcase, GraduationCap, Ruler, Home, Baby } from 'lucide-react';
import { Profile } from '../../utils/dummyData';
import { format } from 'date-fns';

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

  const formatHeight = (profile: Profile) => {
    if (!profile.height) return null;
    
    if (profile.heightUnit === 'ft') {
      return `${profile.height} ft (${profile.heightCm} cm)`;
    } else {
      return `${profile.heightCm} cm (${profile.height} ft)`;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-white">
          {profile.name}
          {profile.showAge !== false && profile.age && `, ${profile.age}`}
        </h1>
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
      
      {/* Personal Details Section */}
      <div>
        <h2 className="text-sm font-medium text-love mb-2">Personal Details</h2>
        <div className="grid grid-cols-2 gap-2">
          {profile.birthday && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <span className="text-sm">Born {format(new Date(profile.birthday), 'MMM d, yyyy')}</span>
            </div>
          )}
          
          {profile.height && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Ruler size={16} className="text-gray-400" />
              <span className="text-sm">{formatHeight(profile)}</span>
            </div>
          )}
          
          {profile.education && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <GraduationCap size={16} className="text-gray-400" />
              <span className="text-sm">{profile.education}</span>
            </div>
          )}
          
          {profile.occupation && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Briefcase size={16} className="text-gray-400" />
              <span className="text-sm">{profile.occupation}</span>
            </div>
          )}
          
          {profile.hasPets && profile.petType && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Home size={16} className="text-gray-400" />
              <span className="text-sm">{profile.petType} owner</span>
            </div>
          )}
          
          {profile.hasChildren && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Baby size={16} className="text-gray-400" />
              <span className="text-sm">
                {profile.childrenCount === 1 
                  ? '1 child' 
                  : `${profile.childrenCount} children`}
              </span>
            </div>
          )}
        </div>
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
