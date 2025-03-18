
import { supabase } from '@/integrations/supabase/client';

/**
 * Updates the verification status of a user profile
 * @param userId The ID of the user to verify
 * @param verified The verification status to set
 * @returns An object containing the updated profile data or an error
 */
export const updateVerificationStatus = async (
  userId: string, 
  verified: boolean = true
) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ verified })
    .eq('id', userId)
    .select()
    .single();
    
  if (error) throw error;
  
  return { data, error: null };
};

/**
 * Checks if a user is verified
 * @param userId The ID of the user to check
 * @returns Boolean indicating verification status
 */
export const isUserVerified = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('verified')
    .eq('id', userId)
    .single();
    
  if (error) throw error;
  
  return data?.verified === true;
};
