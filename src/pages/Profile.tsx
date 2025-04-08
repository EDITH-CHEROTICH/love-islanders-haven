
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth';
import { fetchUserProfile } from '@/services/profiles/core';
import { supabase } from '@/integrations/supabase/client';

import ProfileHeader from '@/components/profile/layout/ProfileHeader';
import ProfileTabs from '@/components/profile/layout/ProfileTabs';
import ProfileEditContent from '@/components/profile/layout/ProfileEditContent';
import ProfileLoadingState from '@/components/profile/layout/ProfileLoadingState';
import ProfileErrorState from '@/components/profile/layout/ProfileErrorState';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserProfile();
    } else {
      // Show a message if not authenticated
      toast({
        title: "Authentication required",
        description: "Please log in to view and edit your profile.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);
  
  const loadUserProfile = async () => {
    setIsLoading(true);
    try {
      // Check if user session exists
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        toast({
          title: "Authentication required",
          description: "Please log in to view your profile.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      const userData = await fetchUserProfile();
      if (userData) {
        setProfile(userData);
      } else {
        // Handle case when no profile exists
        setProfile({
          name: 'New User',
          images: [],
          verified: false,
        });
        
        toast({
          title: "Complete your profile",
          description: "Please add your profile details to get started.",
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Failed to load profile",
        description: "Please try again later or contact support.",
        variant: "destructive"
      });
      setProfile({
        name: 'New User',
        images: [],
        verified: false,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEditProfile = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // Reload profile when exiting edit mode to reflect changes
      loadUserProfile();
    }
  };

  const handleImagesChange = (newImages: string[]) => {
    if (profile) {
      setProfile({
        ...profile,
        images: newImages
      });
    }
  };

  const handleVerificationSuccess = () => {
    if (profile) {
      setProfile({
        ...profile,
        verified: true
      });
    }
  };

  const handlePreferencesUpdated = () => {
    loadUserProfile();
    toast({
      title: "Profile updated",
      description: "Your profile settings have been saved successfully.",
    });
  };
  
  if (isLoading) {
    return <ProfileLoadingState />;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-island-dark via-island to-island-dark pb-20">
        <div className="page-container">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p>Please log in to view and edit your profile.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <ProfileErrorState onRetry={loadUserProfile} />;
  }
  
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
