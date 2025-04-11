
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
    const { data, error } = await updateUserProfile({
      name,
      show_age: showAge
    });
    
    if (error) {
      throw error;
    }
    
    return data;
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
    const { data, error } = await updateUserProfile({
      relationship_goal: relationshipGoal,
      gender_preference: genderPreference
    });
    
    if (error) {
      throw error;
    }
    
    return data;
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
    const { data, error } = await updateUserProfile({ bio });
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error updating bio:', error);
    throw error;
  }
};

/**
 * Saves discover page filter preferences to the user's settings
 */
export const saveDiscoverFilters = async (filters: any) => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('Authentication required to save filters');
    }
    
    // Update the user settings table with the filters
    const { data, error } = await supabase
      .from('user_settings')
      .update({
        match_preferences: {
          discoverFilters: filters
        }
      })
      .eq('id', user.id);
    
    if (error) {
      console.error('Error saving discover filters:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in saveDiscoverFilters:', error);
    throw error;
  }
};

/**
 * Retrieves saved discover filters from user settings
 */
export const getDiscoverFilters = async () => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return null;
    }
    
    const { data, error } = await supabase
      .from('user_settings')
      .select('match_preferences')
      .eq('id', user.id)
      .single();
    
    if (error || !data) {
      console.warn('No saved filters found or error fetching filters');
      return null;
    }
    
    return data.match_preferences?.discoverFilters || null;
  } catch (error) {
    console.error('Error in getDiscoverFilters:', error);
    return null;
  }
};
