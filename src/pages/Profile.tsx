
import React, { useState } from 'react';
import { useProfilePage } from '@/hooks/use-profile-page';

import ProfileHeader from '@/components/profile/layout/ProfileHeader';
import ProfileTabs from '@/components/profile/layout/ProfileTabs';
import ProfileEditContent from '@/components/profile/layout/ProfileEditContent';
import ProfileLoadingState from '@/components/profile/layout/ProfileLoadingState';
import ProfileErrorState from '@/components/profile/layout/ProfileErrorState';
import ProfileAuthRequired from '@/components/profile/layout/ProfileAuthRequired';

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
  
  // Show loading state while auth is still being determined
  if ((loading && !hasAuthenticatedUser) || (isLoading && hasAuthenticatedUser && !hasUsableProfile)) {
    return <ProfileLoadingState />;
  }

  if (!hasAuthenticatedUser) {
    return <ProfileAuthRequired />;
  }

  // Show error state only if we have an error AND no profile data
  if (error && !profile) {
    return <ProfileErrorState onRetry={handleRetry} errorMessage={error} />;
  }
  
  // If we have profile data, show it even if there was an error
  if (profile) {
    return (
      <ProfileContent 
        profile={profile}
        isEditing={isEditing}
        handleEditProfile={handleEditProfile}
        handleImagesChange={handleImagesChange}
        handleVerificationSuccess={handleVerificationSuccess}
        handlePreferencesUpdated={handlePreferencesUpdated}
      />
    );
  }
  
  // Fallback error state
  return <ProfileErrorState onRetry={handleRetry} errorMessage="Unable to load profile" />;
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
