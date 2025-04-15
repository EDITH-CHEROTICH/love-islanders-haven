
import { supabase } from "@/integrations/supabase/client";

interface OnboardingProgressData {
  current_step?: string;
  completed_steps?: string[];
  completed?: boolean;
}

/**
 * Updates the user's onboarding progress in Supabase
 */
export const updateOnboardingProgress = async (data: OnboardingProgressData): Promise<boolean> => {
  try {
    // Get authenticated user
    const { data: authData, error: authError } = await supabase.auth.getUser();
    
    if (authError || !authData.user) {
      console.error("Authentication required to update onboarding progress");
      return false;
    }
    
    const userId = authData.user.id;
    
    // Check if onboarding record exists
    const { data: existingData, error: selectError } = await supabase
      .from('profile_onboarding')
      .select('*')
      .eq('profile_id', userId);
      
    if (selectError) {
      console.error("Error checking onboarding record:", selectError);
      return false;
    }
    
    let result;
    
    // If record exists, update it
    if (existingData && existingData.length > 0) {
      const { error: updateError } = await supabase
        .from('profile_onboarding')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('profile_id', userId);
        
      if (updateError) {
        console.error("Error updating onboarding progress:", updateError);
        return false;
      }
      
      result = true;
    } else {
      // If record doesn't exist, insert a new one
      const { error: insertError } = await supabase
        .from('profile_onboarding')
        .insert({
          profile_id: userId,
          ...data,
          updated_at: new Date().toISOString()
        });
        
      if (insertError) {
        console.error("Error inserting onboarding progress:", insertError);
        return false;
      }
      
      result = true;
    }
    
    return result;
  } catch (error) {
    console.error("Error in updateOnboardingProgress:", error);
    return false;
  }
};

/**
 * Check if the user has completed onboarding
 */
export const checkOnboardingStatus = async (): Promise<{ completed: boolean, currentStep?: string }> => {
  try {
    // Get authenticated user
    const { data: authData, error: authError } = await supabase.auth.getUser();
    
    if (authError || !authData.user) {
      console.error("Authentication required to check onboarding status");
      return { completed: false };
    }
    
    const userId = authData.user.id;
    
    // Get onboarding record
    const { data, error } = await supabase
      .from('profile_onboarding')
      .select('completed, current_step')
      .eq('profile_id', userId)
      .single();
      
    if (error) {
      // No onboarding record means onboarding is not completed
      if (error.code === 'PGRST116') {
        return { completed: false, currentStep: 'basics' };
      }
      
      console.error("Error checking onboarding status:", error);
      return { completed: false };
    }
    
    return { 
      completed: data?.completed || false,
      currentStep: data?.current_step
    };
  } catch (error) {
    console.error("Error in checkOnboardingStatus:", error);
    return { completed: false };
  }
};
