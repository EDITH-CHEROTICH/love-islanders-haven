
import { useState } from 'react';
import { Profile } from '../../utils/dummyData';
import { useToast } from '@/hooks/use-toast';
import { uploadProfileImage, updateImageOrder, deleteProfileImage } from '@/services/profiles/image-upload';
import { updateRelationshipPreferences } from '@/services/profiles/profile-update';
import { updateVerificationStatus } from '@/services/profiles/verification';

interface UseProfileActionsProps {
  profile: Profile;
  setProfile: (profile: Profile) => void;
  setIsLoading: (isLoading: boolean) => void;
  loadUserProfile: () => Promise<void>;
}

export const useProfileActions = ({
  profile,
  setProfile,
  setIsLoading,
  loadUserProfile
}: UseProfileActionsProps) => {
  const { toast } = useToast();
  
  // Handle image upload
  const handleImageUpload = async (file: File): Promise<string | null> => {
    try {
      setIsLoading(true);
      const position = profile.images?.length || 0;
      const imageUrl = await uploadProfileImage(file, position);
      
      // Update profile with new image
      const updatedImages = [...(profile.images || []), imageUrl];
      setProfile({
        ...profile,
        images: updatedImages
      });
      
      toast({
        title: "Image uploaded",
        description: "Your profile image was uploaded successfully.",
      });
      
      return imageUrl;
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle images change (reorder or delete)
  const handleImagesChange = async (newImages: string[]) => {
    try {
      setIsLoading(true);
      
      // Check if we need to delete images
      const imagesToDelete = (profile.images || []).filter(
        img => !newImages.includes(img)
      );
      
      // Delete removed images
      for (const imageUrl of imagesToDelete) {
        await deleteProfileImage(imageUrl);
      }
      
      // Update order for remaining images
      await updateImageOrder(newImages);
      
      // Update profile with new images
      setProfile({
        ...profile,
        images: newImages
      });
      
      toast({
        title: "Images updated",
        description: "Your profile images were updated successfully.",
      });
    } catch (error: any) {
      console.error("Error updating images:", error);
      toast({
        title: "Update failed",
        description: error.message || "Failed to update images. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle videos change
  const handleVideosChange = async (newVideos: string[]) => {
    try {
      setIsLoading(true);
      
      // TODO: Add video upload functionality
      
      // Update profile with new videos
      setProfile({
        ...profile,
        videos: newVideos
      });
      
      toast({
        title: "Videos updated",
        description: "Your profile videos were updated successfully.",
      });
    } catch (error: any) {
      console.error("Error updating videos:", error);
      toast({
        title: "Update failed",
        description: error.message || "Failed to update videos. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle verification request
  const handleVerificationRequest = async () => {
    try {
      setIsLoading(true);
      
      if (!profile.id) {
        throw new Error("User profile not found");
      }
      
      // Call verification service
      const { error } = await updateVerificationStatus(profile.id, true);
      
      if (error) {
        throw error;
      }
      
      // Update profile with verified status
      setProfile({
        ...profile,
        verified: true
      });
      
      toast({
        title: "Verification successful",
        description: "Your profile has been verified.",
      });
    } catch (error: any) {
      console.error("Error requesting verification:", error);
      toast({
        title: "Verification failed",
        description: error.message || "Failed to verify profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle relationship goal change
  const handleRelationshipGoalChange = async (goal: 'long-term' | 'casual' | 'both') => {
    try {
      setIsLoading(true);
      
      // Call update service
      await updateRelationshipPreferences(goal, profile.genderPreference || 'both');
      
      // Update profile with new goal
      setProfile({
        ...profile,
        relationshipGoal: goal
      });
      
      toast({
        title: "Preferences updated",
        description: "Your relationship preferences were updated successfully.",
      });
    } catch (error: any) {
      console.error("Error updating relationship goal:", error);
      toast({
        title: "Update failed",
        description: error.message || "Failed to update preferences. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle gender preference change
  const handleGenderPreferenceChange = async (preference: 'male' | 'female' | 'both') => {
    try {
      setIsLoading(true);
      
      // Call update service
      await updateRelationshipPreferences(profile.relationshipGoal || 'both', preference);
      
      // Update profile with new preference
      setProfile({
        ...profile,
        genderPreference: preference
      });
      
      toast({
        title: "Preferences updated",
        description: "Your gender preferences were updated successfully.",
      });
    } catch (error: any) {
      console.error("Error updating gender preference:", error);
      toast({
        title: "Update failed",
        description: error.message || "Failed to update preferences. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleImageUpload,
    handleImagesChange,
    handleVideosChange,
    handleVerificationRequest,
    handleRelationshipGoalChange,
    handleGenderPreferenceChange,
  };
};
