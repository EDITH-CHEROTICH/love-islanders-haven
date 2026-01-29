
import { supabase } from "@/integrations/supabase/client";

/**
 * Save user interests to their profile
 * Note: Using the profiles.interests array field instead of separate tables
 */
export const saveUserInterests = async (interests: string[]) => {
  const user = supabase.auth.getUser();
  const userId = (await user).data.user?.id;

  if (!userId) {
    throw new Error('User not authenticated');
  }

  // Update the interests array on the profiles table
  const { error } = await supabase
    .from('profiles')
    .update({ interests: interests })
    .eq('id', userId);

  if (error) {
    console.error('Error saving interests:', error);
    throw error;
  }

  return true;
};

/**
 * Fetch interests for a profile
 */
export const fetchProfileInterests = async (profileId?: string): Promise<string[]> => {
  const user = supabase.auth.getUser();
  const userId = profileId || (await user).data.user?.id;

  if (!userId) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('interests')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching interests:', error);
    throw error;
  }

  return data?.interests || [];
};
