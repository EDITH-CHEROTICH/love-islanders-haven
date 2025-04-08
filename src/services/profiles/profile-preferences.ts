
import { supabase } from "@/integrations/supabase/client";

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
