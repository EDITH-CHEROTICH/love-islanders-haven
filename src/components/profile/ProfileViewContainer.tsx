
import { useState } from 'react';
import { Profile } from '../../utils/dummyData';
import { useToast } from '@/hooks/use-toast';
import ProfileViewMode from './ProfileViewMode';
import ProfileEditMode from './ProfileEditMode';
import ProfileActionBar from './ProfileActionBar';
import { useProfileState } from '@/hooks/profile/useProfileState';
import { useProfileActions } from '@/hooks/profile/useProfileActions';

interface ProfileViewProps {
  profile: Profile;
  isEditable?: boolean;
}

const ProfileViewContainer = ({ profile: initialProfile, isEditable = false }: ProfileViewProps) => {
  // Use the custom hooks for state and actions
  const { 
    profile, 
    setProfile, 
    isEditing, 
    setIsEditing, 
    isLoading, 
    setIsLoading,
    loadUserProfile 
  } = useProfileState({ initialProfile, isEditable });

  const { toast } = useToast();

  const { 
    handleImagesChange, 
    handleVideosChange, 
    handleVerificationRequest, 
    handleRelationshipGoalChange, 
    handleGenderPreferenceChange 
  } = useProfileActions({ 
    profile, 
    setProfile, 
    setIsLoading,
    loadUserProfile 
  });

  // Handle edit mode toggle
  const handleEdit = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      toast({
        title: "Edit Mode",
        description: "You can now edit your profile images, videos, verification status, and preferences.",
      });
    }
  };

  return (
    <div className="p-4 animate-fade-in">
      <div className="relative mb-6">
        {isEditable && (
          <ProfileActionBar onEdit={handleEdit} />
        )}
        
        {!isEditing ? (
          <ProfileViewMode profile={profile} />
        ) : (
          <ProfileEditMode 
            profile={profile}
            isLoading={isLoading}
            onImagesChange={handleImagesChange}
            onVideosChange={handleVideosChange}
            onVerificationRequest={handleVerificationRequest}
            onRelationshipGoalChange={handleRelationshipGoalChange}
            onGenderPreferenceChange={handleGenderPreferenceChange}
          />
        )}
      </div>
    </div>
  );
};

export default ProfileViewContainer;
