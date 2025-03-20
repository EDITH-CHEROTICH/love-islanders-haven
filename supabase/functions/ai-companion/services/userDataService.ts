
// Service for fetching and processing user data
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.33.1';
import { 
  fetchUserProfile, 
  fetchUserSettings, 
  fetchUserStreakActivity,
  fetchUserInterests,
  buildUserMemoryContext 
} from '../utils/userContext.ts';

// Initialize a Supabase client for user data operations
export function initializeSupabaseClient() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  return createClient(supabaseUrl, supabaseKey);
}

// Fetch all user context data for AI personalization
export async function fetchUserContextData(supabase, userId: string) {
  if (!userId) {
    return {
      userProfile: null,
      userSettings: null,
      userStreakActivity: null,
      userMemoryContext: "",
      userInterests: []
    };
  }

  try {
    // Fetch user data
    const userProfile = await fetchUserProfile(supabase, userId);
    const userSettings = await fetchUserSettings(supabase, userId);
    const userStreakActivity = await fetchUserStreakActivity(supabase, userId);
    
    // Fetch user interests if profile exists
    let userInterests = [];
    if (userProfile) {
      userInterests = await fetchUserInterests(supabase, userId);
    }
    
    // Build memory context from profile and settings
    const userMemoryContext = buildUserMemoryContext(
      userProfile, 
      userSettings, 
      userStreakActivity, 
      userInterests
    );

    return {
      userProfile,
      userSettings,
      userStreakActivity,
      userMemoryContext,
      userInterests
    };
  } catch (error) {
    console.error("Error building user context:", error);
    throw error;
  }
}
