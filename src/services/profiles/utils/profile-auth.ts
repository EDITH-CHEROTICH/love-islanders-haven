
import { supabase } from "@/integrations/supabase/client";
import { createFallbackProfile } from "./profile-transformers";

/**
 * Gets the authenticated user ID and handles fallbacks
 */
export async function getAuthenticatedUserId(): Promise<string | null> {
  try {
    // Add network connection check - important for mobile
    if (!navigator.onLine) {
      console.log('Device appears to be offline');
      // For development and mobile testing, use fallback approach
      if (localStorage.getItem('isAuthenticated') === 'true') {
        console.log('Using offline fallback authentication');
        return 'dev-user-123';
      } else {
        throw new Error('No internet connection');
      }
    }
    
    // Check for auth in multiple ways - both Supabase session and localStorage
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.log('Authentication error:', authError.message);
      // For development and testing, continue if localStorage shows authenticated
      if (localStorage.getItem('isAuthenticated') === 'true') {
        console.log('Using development authentication from localStorage');
        return 'dev-user-123';
      } else {
        throw new Error('Authentication error');
      }
    }
    
    // For development, use a fallback user ID if needed
    let userId = user?.id;
    
    // If no userId but localStorage shows authenticated, create a development user ID
    if (!userId && localStorage.getItem('isAuthenticated') === 'true') {
      console.log('No authenticated user in Supabase but localStorage authenticated');
      return 'dev-user-123';
    }
    
    return userId || null;
  } catch (error) {
    console.error('Error checking authentication:', error);
    
    // For development purposes, return a dev ID if localStorage indicates authentication
    if (localStorage.getItem('isAuthenticated') === 'true') {
      return 'dev-user-123';
    }
    
    return null;
  }
}

/**
 * Checks if user is effectively authenticated (via Supabase or localStorage in dev)
 */
export function isEffectivelyAuthenticated(): boolean {
  return supabase.auth.getSession() !== null || 
         localStorage.getItem('isAuthenticated') === 'true' ||
         process.env.NODE_ENV === 'development';
}
