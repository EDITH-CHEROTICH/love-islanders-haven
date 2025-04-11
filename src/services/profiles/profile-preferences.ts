
import { supabase } from "@/integrations/supabase/client";
import { DiscoverFilters } from "@/services/discover";

/**
 * Updates the user's relationship goal preference
 */
export const updateRelationshipGoal = async (goal: 'long-term' | 'casual' | 'both') => {
  const user = await supabase.auth.getUser();
  const userId = user.data.user?.id;

  if (!userId) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({ relationship_goal: goal })
    .eq('id', userId)
    .select();

  if (error) {
    console.error('Error updating relationship goal:', error);
    throw error;
  }

  return data;
};

/**
 * Updates the user's gender preference
 */
export const updateGenderPreference = async (preference: 'male' | 'female' | 'both') => {
  const user = await supabase.auth.getUser();
  const userId = user.data.user?.id;

  if (!userId) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({ gender_preference: preference })
    .eq('id', userId)
    .select();

  if (error) {
    console.error('Error updating gender preference:', error);
    throw error;
  }

  return data;
};

/**
 * Retrieves saved discover filters from user settings
 */
export const getDiscoverFilters = async (): Promise<DiscoverFilters | null> => {
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
    
    const matchPreferences = data.match_preferences as { discoverFilters?: Record<string, any> };
    if (!matchPreferences?.discoverFilters) return null;
    
    // Convert from Record<string, any> back to DiscoverFilters
    return matchPreferences.discoverFilters as unknown as DiscoverFilters;
  } catch (error) {
    console.error('Error in getDiscoverFilters:', error);
    return null;
  }
};

/**
 * Saves discover page filter preferences to the user's settings
 */
export const saveDiscoverFilters = async (filters: DiscoverFilters) => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('Authentication required to save filters');
    }
    
    // Convert the filters to a plain object that matches Json type
    const matchPreferences = {
      discoverFilters: filters as unknown as Record<string, any>
    };
    
    // Update the user settings table with the filters
    const { data, error } = await supabase
      .from('user_settings')
      .update({
        match_preferences: matchPreferences
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

