
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth';
import { fetchUserProfile } from '@/services/profiles/core';
import { supabase } from '@/integrations/supabase/client';

const createDefaultProfile = (email?: string | null, id?: string) => ({
  id: id || 'local-profile',
  name: email?.split('@')[0] || 'New User',
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

export function useProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [authReady, setAuthReady] = useState(false);
  const [sessionUser, setSessionUser] = useState<any>(null);
  const { toast } = useToast();
  const { networkError } = useAuth();

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        setSessionUser(data.session?.user ?? null);
      } finally {
        if (mounted) {
          setAuthReady(true);
        }
      }
    };

    void loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setSessionUser(session?.user ?? null);
      setAuthReady(true);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const isAuthenticated = !!sessionUser?.id;
  const user = sessionUser;
  
  // Load user profile when component mounts or when auth state changes
  useEffect(() => {
    if (!authReady) {
      return; // Don't do anything while auth is loading
    }
    
    if (user?.id) {
      void loadUserProfile();
    } else {
      toast({
        title: "Authentication required",
        description: "Please log in to view and edit your profile.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  }, [authReady, user?.id, retryCount]);
  
  const loadUserProfile = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Loading user profile...');
      
      if (!user?.id) {
        console.log('No authentication detected');
        throw new Error('Authentication required');
      }
      
      console.log('Authentication status: Supabase =', isAuthenticated);
      const userData = await fetchUserProfile();
      
      if (userData) {
        console.log('Profile loaded successfully');
        setProfile(userData);
      } else {
        console.log('No profile found, creating default');
        setProfile(createDefaultProfile(user?.email, user?.id));
        
        toast({
          title: "Complete your profile",
          description: "Please add your profile details to get started.",
        });
      }
    } catch (error: any) {
      console.error('Error loading profile:', error);
      setError(error?.message || 'Failed to load profile data');

      if (user?.id) {
        setProfile(createDefaultProfile(user.email, user.id));
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

  return {
    profile,
    isLoading,
    isEditing,
    error,
      loading: !authReady,
    isAuthenticated,
      user,
    handleEditProfile,
    handleRetry,
    handleImagesChange,
    handleVerificationSuccess,
    handlePreferencesUpdated
  };
}
