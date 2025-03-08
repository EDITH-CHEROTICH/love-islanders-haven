
import { useState } from 'react';
import { Profile } from '../utils/dummyData';
import { Edit, Settings, ShieldCheck, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ProfileImageManager from './ProfileImageManager';

interface ProfileViewProps {
  profile: Profile;
  isEditable?: boolean;
}

const ProfileView = ({ profile: initialProfile, isEditable = false }: ProfileViewProps) => {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const handleEdit = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      toast({
        title: "Edit Mode",
        description: "You can now edit your profile images, verification status, and relationship goals.",
      });
    }
  };

  const handleSettings = () => {
    toast({
      title: "Settings",
      description: "Settings functionality will be available soon.",
    });
  };

  const handleImagesChange = (newImages: string[]) => {
    setProfile({
      ...profile,
      images: newImages
    });
  };

  const handleVerificationRequest = () => {
    setProfile({
      ...profile,
      verified: true
    });
  };

  const handleRelationshipGoalChange = (goal: 'long-term' | 'casual' | 'both') => {
    setProfile({
      ...profile,
      relationshipGoal: goal
    });
    
    toast({
      title: "Relationship Goal Updated",
      description: `Your relationship goal has been set to ${getGoalDisplayText(goal)}.`,
    });
  };

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

  return (
    <div className="p-4 animate-fade-in">
      <div className="relative mb-6">
        {isEditable && (
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <button 
              className="bg-island-light/80 p-2 rounded-full hover:bg-island-light transition-colors" 
              aria-label="Edit profile"
              onClick={handleEdit}
            >
              <Edit size={20} className="text-white" />
            </button>
            <button 
              className="bg-island-light/80 p-2 rounded-full hover:bg-island-light transition-colors" 
              aria-label="Settings"
              onClick={handleSettings}
            >
              <Settings size={20} className="text-white" />
            </button>
          </div>
        )}
        
        {!isEditing ? (
          <div className="aspect-square overflow-hidden rounded-xl mb-4">
            <img 
              src={profile.images[0]} 
              alt={profile.name} 
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="mb-4">
            <ProfileImageManager 
              images={profile.images}
              verified={profile.verified || false}
              onImagesChange={handleImagesChange}
              onVerificationRequest={handleVerificationRequest}
            />
          </div>
        )}
        
        <div className="space-y-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white">{profile.name}, {profile.age}</h1>
            {profile.verified && (
              <ShieldCheck size={20} className="text-green-400 ml-2" />
            )}
          </div>
          <p className="text-muted-foreground">{profile.location}</p>
          
          {!isEditing ? (
            <>
              {profile.relationshipGoal && (
                <div className="flex items-center gap-2">
                  <Heart size={16} className="text-love" />
                  <span className="text-love-light">{getGoalDisplayText(profile.relationshipGoal)}</span>
                </div>
              )}
              
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
              
              <div>
                <h2 className="text-sm font-medium text-love mb-2">Photos</h2>
                <div className="grid grid-cols-3 gap-2">
                  {profile.images.map((image, i) => (
                    <div key={i} className="aspect-square rounded-lg overflow-hidden">
                      <img 
                        src={image} 
                        alt={`${profile.name} ${i+1}`}
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="pt-4 border-t border-island-light">
              <h3 className="text-sm font-medium text-love mb-4">What are you looking for?</h3>
              
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleRelationshipGoalChange('long-term')}
                  className={`p-3 rounded-lg flex flex-col items-center text-center transition-colors ${
                    profile.relationshipGoal === 'long-term' 
                      ? 'bg-love text-white' 
                      : 'bg-island-dark/80 hover:bg-island-dark text-muted-foreground hover:text-white'
                  }`}
                >
                  <Heart size={24} className={profile.relationshipGoal === 'long-term' ? 'text-white' : 'text-love'} />
                  <span className="text-sm mt-2">Life-time Partner</span>
                </button>
                
                <button
                  onClick={() => handleRelationshipGoalChange('casual')}
                  className={`p-3 rounded-lg flex flex-col items-center text-center transition-colors ${
                    profile.relationshipGoal === 'casual' 
                      ? 'bg-love text-white' 
                      : 'bg-island-dark/80 hover:bg-island-dark text-muted-foreground hover:text-white'
                  }`}
                >
                  <Heart size={24} className={profile.relationshipGoal === 'casual' ? 'text-white' : 'text-love'} />
                  <span className="text-sm mt-2">Casual Fun</span>
                </button>
                
                <button
                  onClick={() => handleRelationshipGoalChange('both')}
                  className={`p-3 rounded-lg flex flex-col items-center text-center transition-colors ${
                    profile.relationshipGoal === 'both' 
                      ? 'bg-love text-white' 
                      : 'bg-island-dark/80 hover:bg-island-dark text-muted-foreground hover:text-white'
                  }`}
                >
                  <Heart size={24} className={profile.relationshipGoal === 'both' ? 'text-white' : 'text-love'} />
                  <span className="text-sm mt-2">Open to Both</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
