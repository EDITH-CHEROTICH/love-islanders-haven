
import { supabase } from "@/integrations/supabase/client";
import { SupabaseProfile } from "./types";

/**
 * Updates a user's profile information in Supabase
 */
export const updateUserProfile = async (profileData: Partial<SupabaseProfile>) => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    // For development or when Supabase auth is not fully available
    const userId = user?.id || 
                 (localStorage.getItem('isAuthenticated') === 'true' ? 'dev-user-123' : null);
    
    if (!userId) {
      throw new Error('Authentication required to update profile');
    }

    // Handle development mode
    if (process.env.NODE_ENV === 'development' && (!user || localStorage.getItem('isAuthenticated') === 'true')) {
      console.log('Development mode: Simulating profile update with data:', profileData);
      return { ...profileData, id: userId };
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
    
    // For development mode
    if (process.env.NODE_ENV === 'development' && localStorage.getItem('isAuthenticated') === 'true') {
      console.log('Development mode: Simulating display preferences update');
      return { name, show_age: showAge };
    }
    
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
