
import { supabase } from "@/integrations/supabase/client";

export const saveUserInterests = async (interests: string[]) => {
  const user = supabase.auth.getUser();
  const userId = (await user).data.user?.id;

  if (!userId) {
    throw new Error('User not authenticated');
  }

  // First, fetch all interest IDs
  const { data: interestData, error: interestError } = await supabase
    .from('interests')
    .select('id, name')
    .in('name', interests);

  if (interestError) {
    console.error('Error fetching interests:', interestError);
    throw interestError;
  }

  // Delete existing profile interests
  const { error: deleteError } = await supabase
    .from('profile_interests')
    .delete()
    .eq('profile_id', userId);

  if (deleteError) {
    console.error('Error deleting existing interests:', deleteError);
    throw deleteError;
  }

  // Insert new profile interests
  const profileInterests = interestData.map(interest => ({
    profile_id: userId,
    interest_id: interest.id
  }));

  if (profileInterests.length > 0) {
    const { error: insertError } = await supabase
      .from('profile_interests')
      .insert(profileInterests);

    if (insertError) {
      console.error('Error saving interests:', insertError);
      throw insertError;
    }
  }

  return true;
};

export const fetchProfileInterests = async (profileId?: string) => {
  const user = supabase.auth.getUser();
  const userId = profileId || (await user).data.user?.id;

  if (!userId) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('profile_interests')
    .select('interests(name)')
    .eq('profile_id', userId);

  if (error) {
    console.error('Error fetching interests:', error);
    throw error;
  }

  return data.map(item => item.interests.name);
};
