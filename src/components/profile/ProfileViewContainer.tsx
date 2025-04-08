
import { useState, useEffect } from 'react';
import { Profile } from '../../utils/dummyData';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { fetchUserProfile } from '@/services/profiles';
import ProfileViewMode from './ProfileViewMode';
import ProfileEditMode from './ProfileEditMode';
import ProfileActionBar from './ProfileActionBar';

interface ProfileViewProps {
  profile: Profile;
  isEditable?: boolean;
}

const ProfileViewContainer = ({ profile: initialProfile, isEditable = false }: ProfileViewProps) => {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
        // Only update specific fields from real user profile
        setProfile(prev => ({
          ...prev,
          relationshipGoal: profileData.relationship_goal as any || prev.relationshipGoal,
          genderPreference: profileData.gender_preference as any || prev.genderPreference,
          verified: profileData.verified || prev.verified
        }));
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      toast({
        title: "Edit Mode",
        description: "You can now edit your profile images, videos, verification status, and preferences.",
      });
    }
  };

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

  const getGoalDisplayText = (goal?: 'long-term' | 'casual' | 'both') => {
    switch (goal) {
      case 'long-term':
        return 'Life-time Partner';
      case 'casual':
        return 'Casual Fun';
      case 'both':
        return 'Open to Both';
      default:
        return 'Not Specified';
    }
  };

  const getGenderPreferenceText = (preference?: 'male' | 'female' | 'both') => {
    switch (preference) {
      case 'male':
        return 'men';
      case 'female':
        return 'women';
      case 'both':
        return 'everyone';
      default:
        return 'not specified';
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
