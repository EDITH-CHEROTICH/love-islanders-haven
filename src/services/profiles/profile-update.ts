
import { supabase } from "@/integrations/supabase/client";
import { SupabaseProfile } from "./types";

/**
 * Updates a user's profile information in Supabase
 */
export const updateUserProfile = async (profileData: Partial<SupabaseProfile>) => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('Authentication required to update profile');
    }
    
    // No need for instanceof check as dob should already be a string from SupabaseProfile type
    // Just pass the profileData directly
    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', user.id)
      .select();
    
    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
    
    console.log('Profile updated successfully:', data);
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
    const result = await updateUserProfile({
      name,
      show_age: showAge
    });
    
    return result;
  } catch (error) {
    console.error('Error updating display preferences:', error);
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
    
    return result;
  } catch (error) {
    console.error('Error updating relationship preferences:', error);
    throw error;
  }
};

/**
 * Updates user bio
 */
export const updateUserBio = async (bio: string) => {
  try {
    const result = await updateUserProfile({ bio });
    
    return result;
  } catch (error) {
    console.error('Error updating bio:', error);
    throw error;
  }
};
