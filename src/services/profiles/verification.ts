
import { supabase } from "@/integrations/supabase/client";

/**
 * Updates a user's verification status in the database
 * @param userId The user ID to update
 * @param isVerified The verification status to set
 * @returns Object containing data or error
 */
export const updateVerificationStatus = async (userId: string, isVerified: boolean) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ verified: isVerified })
      .eq('id', userId)
      .select();
    
    return { data, error };
  } catch (error) {
    console.error('Error updating verification status:', error);
    return { data: null, error };
  }
};

/**
 * Gets the current verification status for a user
 * @param userId The user ID to check
 * @returns Boolean indicating if the user is verified or not
 */
export const getVerificationStatus = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('verified')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    return data?.verified || false;
  } catch (error) {
    console.error('Error getting verification status:', error);
    return false;
  }
};
