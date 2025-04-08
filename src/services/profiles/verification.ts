import { supabase } from "@/integrations/supabase/client";

/**
 * Update verification status for a user profile
 */
export const updateVerificationStatus = async (userId: string, status: boolean) => {
  try {
    // Attempt to update using the client first (works if RLS permits)
    const { data, error } = await supabase
      .from('profiles')
      .update({ verified: status })
      .eq('id', userId);
      
    if (error) {
      console.warn("Client-side update failed, trying with admin function:", error);
      
      // If that fails, use the edge function to bypass RLS
      const functionResponse = await supabase.functions.invoke('create-user-profile', {
        body: { 
          userId,
          verified: status,
          // Keep these undefined so they don't overwrite existing values
          name: undefined,
          emailVerified: undefined
        }
      });
      
      if (functionResponse.error) {
        throw new Error(functionResponse.error.message);
      }
      
      return { data: functionResponse.data, error: null };
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
      .eq('id', userId);
    
    if (error) {
      console.warn("Client-side update failed, trying with admin function:", error);
      
      // Use the edge function as fallback
      const functionResponse = await supabase.functions.invoke('create-user-profile', {
        body: { 
          userId,
          emailVerified: status,
          // Keep these undefined so they don't overwrite existing values
          name: undefined,
          verified: undefined
        }
      });
      
      if (functionResponse.error) {
        throw new Error(functionResponse.error.message);
      }
      
      return { data: functionResponse.data, error: null };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error("Error updating email verification status:", error);
    return { data: null, error };
  }
};
