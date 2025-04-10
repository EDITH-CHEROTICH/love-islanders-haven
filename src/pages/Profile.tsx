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
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();
  const { isAuthenticated, user, loading, networkError } = useAuth();
  
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
  }, [isAuthenticated, loading, retryCount]);
  
  const loadUserProfile = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Loading user profile...');
      
      // For development purposes, we'll consider the user authenticated if localStorage says so
      const localStorageAuth = localStorage.getItem('isAuthenticated') === 'true';
      
      if (!isAuthenticated && !localStorageAuth) {
        console.log('No authentication detected');
        throw new Error('Authentication required');
      }
      
      console.log('Authentication status: Supabase =', isAuthenticated, 'localStorage =', localStorageAuth);
      const userData = await fetchUserProfile();
      
      if (userData) {
        console.log('Profile loaded successfully');
        setProfile(userData);
      } else {
        // Create a default profile if none exists
        console.log('No profile found, creating default');
        setProfile({
          name: user?.email?.split('@')[0] || 'New User',
          images: [],
          verified: false,
          gender_preference: 'both',
          relationship_goal: 'both'
        });
        
        toast({
          title: "Complete your profile",
          description: "Please add your profile details to get started.",
        });
      }
    } catch (error: any) {
      console.error('Error loading profile:', error);
      setError(error?.message || 'Failed to load profile data');
      
      // For development purposes, provide a default profile even on error
      if (localStorage.getItem('isAuthenticated') === 'true' || process.env.NODE_ENV === 'development') {
        console.log('Creating default profile due to error');
        setProfile({
          name: user?.email?.split('@')[0] || 'Development User',
          images: [],
          verified: false,
          gender_preference: 'both',
          relationship_goal: 'both'
        });
      }
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
  
  const handleRetry = () => {
    // Initialize Supabase session if needed
    if (networkError) {
      supabase.auth.refreshSession();
    }
    setRetryCount(prev => prev + 1);
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

  // Check authentication status from both supabase and localStorage
  // Always consider authenticated in development mode
  const effectivelyAuthenticated = isAuthenticated || 
    localStorage.getItem('isAuthenticated') === 'true' || 
    process.env.NODE_ENV === 'development';

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

  // Show error state only if we have an error AND no profile data
  if (error && !profile) {
    return <ProfileErrorState onRetry={handleRetry} errorMessage={error} />;
  }
  
  // If we have profile data, show it even if there was an error
  if (profile) {
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
  }
  
  // Fallback error state
  return <ProfileErrorState onRetry={handleRetry} errorMessage="Unable to load profile" />;
};

export default Profile;
