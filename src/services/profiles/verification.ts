
import { supabase } from "@/integrations/supabase/client";

/**
 * Update verification status for a user profile
 */
export const updateVerificationStatus = async (userId: string, status: boolean) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ verified: status })
      .eq('id', userId);
      
    return { data, error };
  } catch (error) {
    console.error("Error updating verification status:", error);
    return { data: null, error };
  }
};
