
import React, { useState } from 'react';
import { useProfilePage } from '@/hooks/use-profile-page';

import ProfileHeader from '@/components/profile/layout/ProfileHeader';
import ProfileTabs from '@/components/profile/layout/ProfileTabs';
import ProfileEditContent from '@/components/profile/layout/ProfileEditContent';
import ProfileLoadingState from '@/components/profile/layout/ProfileLoadingState';
import ProfileErrorState from '@/components/profile/layout/ProfileErrorState';
import ProfileAuthRequired from '@/components/profile/layout/ProfileAuthRequired';

const createFallbackProfile = () => ({
  id: 'profile-fallback',
  name: localStorage.getItem('authContact')?.split('@')[0] || 'My Profile',
  age: 0,
  bio: '',
  distance: 0,
  occupation: '',
  education: '',
  images: [],
  interests: [],
  relationshipGoal: 'both' as const,
  height: '',
  lastActive: new Date().toISOString(),
  verified: false,
  location: '',
  genderPreference: 'both' as const,
  showAge: true,
});

const Profile = () => {
  const {
    profile,
    isLoading,
    isEditing,
    error,
    loading,
    isAuthenticated,
    user,
    handleEditProfile,
    handleRetry,
    handleImagesChange,
    handleVerificationSuccess,
    handlePreferencesUpdated
  } = useProfilePage();
  const hasUsableProfile = !!profile;
  const hasAuthenticatedUser = !!user?.id || isAuthenticated;
  const resolvedProfile = profile ?? createFallbackProfile();
  
  // Show loading state while auth is still being determined
  if (loading && !hasAuthenticatedUser) {
    return <ProfileLoadingState />;
  }

  if (!hasAuthenticatedUser) {
    return <ProfileAuthRequired />;
  }

  if (error && !hasAuthenticatedUser) {
    return <ProfileErrorState onRetry={handleRetry} errorMessage={error} />;
  }

  return (
    <ProfileContent 
      profile={resolvedProfile}
      isEditing={isEditing}
      handleEditProfile={handleEditProfile}
      handleImagesChange={handleImagesChange}
      handleVerificationSuccess={handleVerificationSuccess}
      handlePreferencesUpdated={handlePreferencesUpdated}
    />
  );
};

// Extract the content to a separate component to make the main component cleaner
interface ProfileContentProps {
  profile: any;
  isEditing: boolean;
  handleEditProfile: () => void;
  handleImagesChange: (newImages: string[]) => void;
  handleVerificationSuccess: () => void;
  handlePreferencesUpdated: () => void;
}

const ProfileContent = ({ 
  profile, 
  isEditing, 
  handleEditProfile,
  handleImagesChange,
  handleVerificationSuccess,
  handlePreferencesUpdated
}: ProfileContentProps) => {
  const [activeTab, setActiveTab] = useState('profile');
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-island-dark via-island to-island-dark pb-20">
      <div className="page-container">
        <ProfileHeader isEditing={isEditing} onEditToggle={handleEditProfile} />
        
        {!isEditing ? (
          <ProfileTabs 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            profile={profile}
            onEdit={handleEditProfile}
          />
        ) : (
          <ProfileEditContent
            profile={profile}
            onDoneEditing={handleEditProfile}
            onImagesChange={handleImagesChange}
            onVerificationSuccess={handleVerificationSuccess}
            onPreferencesUpdated={handlePreferencesUpdated}
          />
        )}
      </div>
    </div>
  );
};

export default Profile;
