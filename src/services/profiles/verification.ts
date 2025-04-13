
import { supabase } from "@/integrations/supabase/client";

/**
 * Update verification status for a user profile
 */
export const updateVerificationStatus = async (userId: string, status: boolean) => {
  try {
    console.log('Updating verification status for user', userId, 'to', status);
    
    // Attempt to update using the client first (works if RLS permits)
    const { data, error } = await supabase
      .from('profiles')
      .update({ verified: status })
      .eq('id', userId)
      .select();
      
    if (error) {
      console.warn("Client-side update failed, trying direct approach:", error);
      
      // Get the current session to verify authentication
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        throw new Error('Authentication required to update verification status');
      }
      
      // Try a direct update as the authenticated user
      const { error: directError } = await supabase
        .from('profiles')
        .update({ verified: status })
        .eq('id', userId);
        
      if (directError) {
        throw directError;
      }
      
      // Fetch the updated profile
      const { data: updatedProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      return { data: updatedProfile, error: null };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error("Error updating verification status:", error);
    return { data: null, error };
  }
};

/**
 * Update email verification status for a user profile
 */
export const updateEmailVerificationStatus = async (userId: string, status: boolean) => {
  try {
    // Attempt regular update first
    const { data, error } = await supabase
      .from('profiles')
      .update({ email_verified: status })
      .eq('id', userId)
      .select();
    
    if (error) {
      console.warn("Client-side update failed:", error);
      
      // Try direct update as authenticated user
      const { error: directError } = await supabase
        .from('profiles')
        .update({ email_verified: status })
        .eq('id', userId);
        
      if (directError) {
        throw directError;
      }
      
      // Fetch the updated profile
      const { data: updatedProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      return { data: updatedProfile, error: null };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error("Error updating email verification status:", error);
    return { data: null, error };
  }
};
