
import { supabase } from "@/integrations/supabase/client";
import { SupabaseProfile } from "./types";

const PROFILE_DB_FIELDS = new Set([
  'id', 'name', 'email', 'age', 'dob', 'show_age', 'gender', 'gender_preference', 'height_cm',
  'occupation', 'education', 'location', 'bio', 'avatar_url', 'interests', 'verified',
  'relationship_goal', 'email_verified', 'streak_count', 'drinking_habit', 'smoking_habit',
  'communication_style', 'love_language', 'zodiac_sign', 'hometown', 'pronouns', 'city',
  'country', 'display_name', 'age_range_min', 'age_range_max', 'distance_preference',
  'show_me_verified_only', 'onboarding_completed', 'updated_at'
]);

const toProfileDbPayload = (profileData: Record<string, any>) => {
  const normalized = {
    ...profileData,
    gender_preference: profileData.gender_preference ?? profileData.genderPreference,
    relationship_goal: profileData.relationship_goal ?? profileData.relationshipGoal,
    show_age: profileData.show_age ?? profileData.showAge,
    height_cm: profileData.height_cm ?? profileData.heightCm,
    drinking_habit: profileData.drinking_habit ?? profileData.drinking,
    smoking_habit: profileData.smoking_habit ?? profileData.smoking,
  };

  return Object.fromEntries(
    Object.entries(normalized).filter(([key, value]) => PROFILE_DB_FIELDS.has(key) && value !== undefined)
  );
};

/**
 * Creates a new user profile or updates an existing one
 */
export const createUserProfile = async (profileData: Record<string, any>): Promise<{ data: any; error: any }> => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error("Error getting authenticated user:", authError);
      throw new Error('Authentication required to create profile');
    }
    
    // Prepare profile data with user ID and ensure Date is converted to string
    const profile = {
      ...toProfileDbPayload(profileData),
      id: user.id,
      updated_at: new Date().toISOString(),
      // No need for instanceof check since dob should already be a string
      // Just ensure it's properly formatted if provided
      name: profileData.name || user.email?.split('@')[0] || 'User' // Ensure name is provided
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
