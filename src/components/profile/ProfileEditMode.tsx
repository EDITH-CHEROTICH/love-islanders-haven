
import { useState } from 'react';
import { Profile } from '../../utils/dummyData';
import ProfileImageManager from './ProfileImageManager';
import VideoUploader from '../VideoUploader';
import GenderSelector from './GenderSelector';
import RelationshipGoalSelector from './RelationshipGoalSelector';

interface ProfileEditModeProps {
  profile: Profile;
  isLoading: boolean;
  onImagesChange: (images: string[]) => void;
  onVideosChange: (videos: string[]) => void;
  onVerificationRequest: () => void;
  onRelationshipGoalChange: (goal: 'long-term' | 'casual' | 'both') => void;
  onGenderPreferenceChange: (preference: 'male' | 'female' | 'both') => void;
}

const ProfileEditMode = ({ 
  profile, 
  isLoading,
  onImagesChange,
  onVideosChange,
  onVerificationRequest,
  onRelationshipGoalChange,
  onGenderPreferenceChange
}: ProfileEditModeProps) => {
  const [activeTab, setActiveTab] = useState<'images' | 'videos'>('images');
  
  return (
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
          onImagesChange={onImagesChange}
          onVerificationRequest={onVerificationRequest}
        />
      ) : (
        <VideoUploader 
          videos={profile.videos || []}
          onVideosChange={onVideosChange}
        />
      )}
      
      <div className="space-y-6 mt-6">
        <RelationshipGoalSelector 
          selectedGoal={profile.relationshipGoal || 'both'} 
          onGoalChange={onRelationshipGoalChange}
          isLoading={isLoading}
        />
        
        <GenderSelector
          selectedPreference={profile.genderPreference || 'both'}
          onPreferenceChange={onGenderPreferenceChange}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ProfileEditMode;
