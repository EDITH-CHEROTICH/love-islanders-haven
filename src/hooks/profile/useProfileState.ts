
import { useState, useEffect } from 'react';
import { Profile } from '../../utils/dummyData';
import { fetchUserProfile } from '@/services/profiles';
import { supabase } from '@/integrations/supabase/client';
import { SupabaseProfile } from '@/services/profiles/types';

interface UseProfileStateProps {
  initialProfile: Profile;
  isEditable: boolean;
}

export const useProfileState = ({ initialProfile, isEditable }: UseProfileStateProps) => {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEditable) {
      // Try to load real profile data from Supabase if it's the user's own profile
      loadUserProfile();
    }
  }, [isEditable]);

  const loadUserProfile = async () => {
    try {
      const userSession = await supabase.auth.getSession();
      if (!userSession.data.session) return;
      
      const profileData = await fetchUserProfile();
      if (profileData) {
        // Handle optional fields properly
        setProfile(prev => ({
          ...prev,
          relationshipGoal: (profileData as SupabaseProfile).relationship_goal as 'long-term' | 'casual' | 'both' | undefined || prev.relationshipGoal,
          genderPreference: (profileData as SupabaseProfile).gender_preference as 'male' | 'female' | 'both' | undefined || prev.genderPreference,
          verified: profileData.verified || prev.verified
        }));
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  return {
    profile,
    setProfile,
    isEditing,
    setIsEditing,
    isLoading,
    setIsLoading,
    loadUserProfile
  };
};
