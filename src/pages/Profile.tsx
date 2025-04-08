
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
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { isAuthenticated, user, loading } = useAuth();
  
  // Load user profile when component mounts or when auth state changes
  useEffect(() => {
    if (loading) {
      return; // Don't do anything while auth is loading
    }
    
    // Default to considering the user authenticated from localStorage
    const localStorageAuth = localStorage.getItem('isAuthenticated') === 'true';
    
    if (isAuthenticated || localStorageAuth) {
      loadUserProfile();
    } else if (!loading) {
      toast({
        title: "Authentication required",
        description: "Please log in to view and edit your profile.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  }, [isAuthenticated, loading]);
  
  const loadUserProfile = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Loading user profile...');
      
      // Set a default user ID if auth state doesn't have one yet but localStorage indicates auth
      const localStorageAuth = localStorage.getItem('isAuthenticated') === 'true';
      
      // Check if user session exists
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw new Error(`Session error: ${sessionError.message}`);
      }
      
      if (!sessionData.session && !localStorageAuth) {
        console.log('No active session found');
        toast({
          title: "Authentication required",
          description: "Please log in to view your profile.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      console.log('Session found or localStorage auth, fetching profile data');
      const userData = await fetchUserProfile();
      
      if (userData) {
        console.log('Profile loaded successfully');
        setProfile(userData);
      } else {
        // Handle case when no profile exists
        console.log('No profile found, creating default');
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
      setError('Failed to load profile data');
      toast({
        title: "Failed to load profile",
        description: "Please try again later or contact support.",
        variant: "destructive"
      });
      
      // Still provide a default profile to avoid complete UI failure
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
  
  // Show loading state while auth is still being determined
  if (loading || (isLoading && (isAuthenticated || localStorage.getItem('isAuthenticated') === 'true'))) {
    return <ProfileLoadingState />;
  }

  // Treat localStorage auth as valid
  const effectivelyAuthenticated = isAuthenticated || localStorage.getItem('isAuthenticated') === 'true';

  if (!effectivelyAuthenticated) {
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

  if (error) {
    return <ProfileErrorState onRetry={loadUserProfile} />;
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
