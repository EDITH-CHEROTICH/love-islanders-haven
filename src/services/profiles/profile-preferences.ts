
import { supabase } from "@/integrations/supabase/client";
import { DiscoverFilters } from "@/services/discover";

/**
 * Updates the user's relationship goal preference
 * Note: Stored in user_settings as JSON since profiles table doesn't have this column
 */
export const updateRelationshipGoal = async (goal: 'long-term' | 'casual' | 'both') => {
  const user = await supabase.auth.getUser();
  const userId = user.data.user?.id;

  if (!userId) {
    throw new Error('User not authenticated');
  }

  // Store in localStorage as fallback since column doesn't exist
  localStorage.setItem('relationship_goal', goal);
  console.log('Relationship goal updated:', goal);
  
  return [{ id: userId, relationship_goal: goal }];
};

/**
 * Updates the user's gender preference
 * Note: Stored in localStorage as fallback
 */
export const updateGenderPreference = async (preference: 'male' | 'female' | 'both') => {
  const user = await supabase.auth.getUser();
  const userId = user.data.user?.id;

  if (!userId) {
    throw new Error('User not authenticated');
  }

  // Store in localStorage as fallback
  localStorage.setItem('gender_preference', preference);
  console.log('Gender preference updated:', preference);
  
  return [{ id: userId, gender_preference: preference }];
};

/**
 * Retrieves saved discover filters from localStorage
 */
export const getDiscoverFilters = async (): Promise<DiscoverFilters | null> => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return null;
    }
    
    // Get from localStorage
    const storedFilters = localStorage.getItem('discover_filters');
    if (storedFilters) {
      return JSON.parse(storedFilters) as DiscoverFilters;
    }
    
    return null;
  } catch (error) {
    console.error('Error in getDiscoverFilters:', error);
    return null;
  }
};

/**
 * Saves discover page filter preferences to localStorage
 */
export const saveDiscoverFilters = async (filters: DiscoverFilters) => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('Authentication required to save filters');
    }
    
    // Store in localStorage
    localStorage.setItem('discover_filters', JSON.stringify(filters));
    console.log('Discover filters saved:', filters);
    
    return true;
  } catch (error) {
    console.error('Error in saveDiscoverFilters:', error);
    throw error;
  }
};
