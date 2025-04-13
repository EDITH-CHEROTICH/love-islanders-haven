
import { supabase } from "@/integrations/supabase/client";
import { SupabaseProfile } from "./types";

/**
 * Creates a new user profile or updates an existing one
 */
export const createUserProfile = async (profileData: Partial<SupabaseProfile>): Promise<{ data: any; error: any }> => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error("Error getting authenticated user:", authError);
      throw new Error('Authentication required to create profile');
    }
    
    // Prepare profile data with user ID and ensure Date is converted to string
    const profile = {
      ...profileData,
      id: user.id,
      updated_at: new Date().toISOString(),
      // Ensure Date objects are converted to ISO strings
      dob: profileData.dob instanceof Date ? profileData.dob.toISOString() : profileData.dob
    };
    
    // Use upsert to handle both creation and update
    const { data, error } = await supabase
      .from('profiles')
      .upsert(profile, {
        onConflict: 'id'
      })
      .select();
    
    if (error) {
      console.error('Error creating/updating profile:', error);
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error: any) {
    console.error('Error in createUserProfile:', error);
    return { data: null, error };
  }
};

/**
 * Handles email verification and profile creation for a new user
 */
export const setupUserProfileAfterVerification = async (userId: string, email: string): Promise<boolean> => {
  try {
    // Create or update profile with email verified status
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        name: email.split('@')[0],
        email_verified: true,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      });

    if (error) {
      console.error("Error creating profile after verification:", error);
      // Try using the edge function as fallback
      try {
        const { error: funcError } = await supabase.functions.invoke('create-user-profile', {
          body: { 
            userId, 
            name: email.split('@')[0],
            emailVerified: true
          }
        });
        
        if (funcError) {
          throw funcError;
        }
      } catch (funcErr) {
        console.error("Edge function error:", funcErr);
        return false;
      }
    }
    
    // Mark email as verified in localStorage
    localStorage.setItem('emailVerificationCompleted', 'true');
    return true;
    
  } catch (error) {
    console.error("Error in setupUserProfileAfterVerification:", error);
    return false;
  }
};
