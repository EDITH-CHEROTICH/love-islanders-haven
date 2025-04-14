
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
        return null; // Don't return fake UUID as it causes database errors
      } else {
        throw new Error('No internet connection');
      }
    }
    
    // Check for auth in multiple ways - both Supabase session and localStorage
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.log('Authentication error:', authError.message);
      // For development and testing, continue if localStorage shows authenticated
      if (localStorage.getItem('isAuthenticated') === 'true' || process.env.NODE_ENV === 'development') {
        console.log('Using development authentication from localStorage');
        // Don't return a fake ID here, just signify we're in dev mode
        return null;
      } else {
        throw new Error('Authentication error');
      }
    }
    
    // Return the actual user ID from Supabase
    return user?.id || null;
  } catch (error) {
    console.error('Error checking authentication:', error);
    
    // For development purposes, don't return a fake ID
    if (localStorage.getItem('isAuthenticated') === 'true' || process.env.NODE_ENV === 'development') {
      console.log('Development mode activated, not using real database');
      return null;
    }
    
    return null;
  }
}

/**
 * Checks if user is effectively authenticated (via Supabase or localStorage in dev)
 */
export function isEffectivelyAuthenticated(): boolean {
  // For mobile, we need to check more thoroughly
  if (typeof window !== 'undefined') {
    const hasLocalAuth = localStorage.getItem('isAuthenticated') === 'true';
    const isDev = process.env.NODE_ENV === 'development';
    
    // When on mobile or in development, be more lenient with auth checks
    if (hasLocalAuth && (window.matchMedia('(max-width: 768px)').matches || isDev)) {
      return true;
    }
  }
  
  // Default to checking Supabase session
  return supabase.auth.getSession() !== null || 
         localStorage.getItem('isAuthenticated') === 'true' ||
         process.env.NODE_ENV === 'development';
}
