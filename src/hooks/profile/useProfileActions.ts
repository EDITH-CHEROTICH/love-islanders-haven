
import { Dispatch, SetStateAction } from 'react';
import { Profile } from '../../utils/dummyData';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getGoalDisplayText, getGenderPreferenceText } from '@/utils/profileFormatters';

interface UseProfileActionsProps {
  profile: Profile;
  setProfile: Dispatch<SetStateAction<Profile>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  loadUserProfile: () => Promise<void>;
}

export const useProfileActions = ({ 
  profile, 
  setProfile, 
  setIsLoading,
  loadUserProfile
}: UseProfileActionsProps) => {
  const { toast } = useToast();

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

  const handleRelationshipGoalChange = async (goal: 'long-term' | 'casual' | 'both') => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ relationship_goal: goal })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);
      
      if (error) throw error;
      
      setProfile({
        ...profile,
        relationshipGoal: goal
      });
      
      toast({
        title: "Relationship Goal Updated",
        description: `Your relationship goal has been set to ${getGoalDisplayText(goal)}.`,
      });
    } catch (error) {
      console.error('Error updating relationship goal:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update your relationship goal. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenderPreferenceChange = async (preference: 'male' | 'female' | 'both') => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ gender_preference: preference })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);
      
      if (error) throw error;
      
      setProfile({
        ...profile,
        genderPreference: preference
      });
      
      toast({
        title: "Preference Updated",
        description: `You will now see ${getGenderPreferenceText(preference)}.`,
      });
    } catch (error) {
      console.error('Error updating gender preference:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update your gender preference. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleImagesChange,
    handleVideosChange,
    handleVerificationRequest,
    handleRelationshipGoalChange,
    handleGenderPreferenceChange
  };
};
