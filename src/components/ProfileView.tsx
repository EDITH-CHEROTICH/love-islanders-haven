
import { useState } from 'react';
import { Profile } from '../utils/dummyData';
import { useToast } from '@/hooks/use-toast';
import ProfileImageManager from './ProfileImageManager';
import VideoUploader from './VideoUploader';
import GenderSelector from './profile/GenderSelector';
import RelationshipGoalSelector from './profile/RelationshipGoalSelector';
import ProfileDetails from './profile/ProfileDetails';
import ProfileMedia from './profile/ProfileMedia';
import ProfileActionBar from './profile/ProfileActionBar';

interface ProfileViewProps {
  profile: Profile;
  isEditable?: boolean;
}

const ProfileView = ({ profile: initialProfile, isEditable = false }: ProfileViewProps) => {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'images' | 'videos'>('images');
  const { toast } = useToast();

  const handleEdit = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      toast({
        title: "Edit Mode",
        description: "You can now edit your profile images, videos, verification status, and preferences.",
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

  const handleVideosChange = (newVideos: string[]) => {
    setProfile({
      ...profile,
      videos: newVideos || []
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

  const handleGenderPreferenceChange = (preference: 'male' | 'female' | 'both') => {
    setProfile({
      ...profile,
      genderPreference: preference
    });
    
    toast({
      title: "Preference Updated",
      description: `You will now see ${getGenderPreferenceText(preference)}.`,
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

  return (
    <div className="p-4 animate-fade-in">
      <div className="relative mb-6">
        {isEditable && (
          <ProfileActionBar onEdit={handleEdit} onSettings={handleSettings} />
        )}
        
        {!isEditing ? (
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
        ) : (
          <div className="mb-4">
            <div className="flex mb-4 border-b border-island-light">
              <button
                onClick={() => setActiveTab('images')}
                className={`py-2 px-4 ${activeTab === 'images' ? 'text-love border-b-2 border-love' : 'text-muted-foreground'}`}
              >
                Images
              </button>
              <button
                onClick={() => setActiveTab('videos')}
                className={`py-2 px-4 ${activeTab === 'videos' ? 'text-love border-b-2 border-love' : 'text-muted-foreground'}`}
              >
                Videos
              </button>
            </div>
            
            {activeTab === 'images' ? (
              <ProfileImageManager 
                images={profile.images}
                verified={profile.verified || false}
                onImagesChange={handleImagesChange}
                onVerificationRequest={handleVerificationRequest}
              />
            ) : (
              <VideoUploader 
                videos={profile.videos || []}
                onVideosChange={handleVideosChange}
              />
            )}
            
            <div className="space-y-6 mt-6">
              <RelationshipGoalSelector 
                selectedGoal={profile.relationshipGoal || 'both'} 
                onGoalChange={handleRelationshipGoalChange} 
              />
              
              <GenderSelector
                selectedPreference={profile.genderPreference || 'both'}
                onPreferenceChange={handleGenderPreferenceChange}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileView;
