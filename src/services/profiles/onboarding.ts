
import { supabase } from '@/integrations/supabase/client';

export interface OnboardingProgressData {
  current_step?: string;
  completed?: boolean;
}

export const updateOnboardingProgress = async (data: OnboardingProgressData) => {
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  // Update the onboarding progress
  const { error } = await supabase
    .from('profile_onboarding')
    .update(data)
    .eq('profile_id', user.id);
    
  if (error) {
    console.error('Error updating onboarding progress:', error);
    throw error;
  }
  
  return true;
};

export const getOnboardingProgress = async () => {
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  // Get the onboarding progress
  const { data, error } = await supabase
    .from('profile_onboarding')
    .select('*')
    .eq('profile_id', user.id)
    .single();
    
  if (error) {
    console.error('Error getting onboarding progress:', error);
    throw error;
  }
  
  return data;
};
