
import { supabase } from "@/integrations/supabase/client";
import { SupabaseProfile } from "./types";
import { toast } from "sonner";

/**
 * Updates a user's profile information in Supabase
 */
export const updateUserProfile = async (profileData: Partial<SupabaseProfile>) => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    // For development or when Supabase auth is not fully available
    let userId = user?.id;
    const devMode = !userId && (localStorage.getItem('isAuthenticated') === 'true' || process.env.NODE_ENV === 'development');
    
    if (!userId && !devMode) {
      toast.error("Authentication required to update profile");
      throw new Error('Authentication required to update profile');
    }

    // Handle development mode
    if (devMode) {
      console.log('Development mode: Simulating profile update with data:', profileData);
      // Just return the data without attempting to update the database
      return { ...profileData, id: 'dev-user-123' };
    }
    
    console.log('Updating profile with data:', profileData);
    
    // Ensure any Date objects are converted to ISO strings
    const cleanData = { ...profileData };
    Object.keys(cleanData).forEach(key => {
      const value = cleanData[key];
      // Check if value is a Date
      if (value instanceof Date) {
        cleanData[key] = value.toISOString();
      }
    });
    
    // Pass the profileData directly to Supabase
    const { data, error } = await supabase
      .from('profiles')
      .update(cleanData)
      .eq('id', userId)
      .select();
    
    if (error) {
      console.error('Error updating profile:', error);
      toast.error("Failed to update profile: " + error.message);
      throw error;
    }
    
    console.log('Profile updated successfully:', data);
    toast.success("Profile updated successfully");
    return data;
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    throw error;
  }
};

/**
 * Updates user display preferences (name, show_age, etc.)
 */
export const updateDisplayPreferences = async (name: string, showAge: boolean) => {
  try {
    console.log('Updating display preferences:', { name, showAge });
    
    // Check if in development mode
    const { data: { user } } = await supabase.auth.getUser();
    const devMode = !user?.id && (localStorage.getItem('isAuthenticated') === 'true' || process.env.NODE_ENV === 'development');
    
    if (devMode) {
      console.log('Development mode: Simulating display preferences update');
      toast.success("Display preferences updated");
      return { name, show_age: showAge, id: 'dev-user-123' };
    }
    
    const result = await updateUserProfile({
      name,
      show_age: showAge
    });
    
    toast.success("Display preferences updated successfully");
    return result;
  } catch (error) {
    console.error('Error updating display preferences:', error);
    toast.error("Failed to update display preferences");
    throw error;
  }
};

/**
 * Updates user relationship preferences
 */
export const updateRelationshipPreferences = async (
  relationshipGoal: 'long-term' | 'casual' | 'both',
  genderPreference: 'male' | 'female' | 'both'
) => {
  try {
    const result = await updateUserProfile({
      relationship_goal: relationshipGoal,
      gender_preference: genderPreference
    });
    
    toast.success("Relationship preferences updated successfully");
    return result;
  } catch (error) {
    console.error('Error updating relationship preferences:', error);
    toast.error("Failed to update relationship preferences");
    throw error;
  }
};

/**
 * Updates user bio
 */
export const updateUserBio = async (bio: string) => {
  try {
    const result = await updateUserProfile({ bio });
    toast.success("Bio updated successfully");
    
    return result;
  } catch (error) {
    console.error('Error updating bio:', error);
    toast.error("Failed to update bio");
    throw error;
  }
};
