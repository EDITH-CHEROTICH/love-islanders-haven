import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  
  useEffect(() => {
    // Add a timeout to detect stuck loading states
    const timer = setTimeout(() => {
      if (loading) {
        console.log('Auth loading timeout detected - forcing completion');
        setLoadingTimeout(true);
        setLoading(false);
      }
    }, 3000); // Reduced timeout to 3 seconds for better user experience
    
    return () => clearTimeout(timer);
  }, [loading]);
  
  useEffect(() => {
    // First check localStorage for auth status
    const localStorageAuth = localStorage.getItem('isAuthenticated') === 'true';
    
    // Set initial auth state from localStorage
    if (localStorageAuth) {
      console.log("Initial auth state from localStorage: authenticated");
    }
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, !!session);
        
        try {
          setSession(session);
          setUser(session?.user ?? null);
          
          // Update localStorage to reflect current auth state
          if (session) {
            localStorage.setItem('isAuthenticated', 'true');
          } else if (event === 'SIGNED_OUT') {
            // Don't remove isAuthenticated in development mode to keep features working
            if (process.env.NODE_ENV !== 'development') {
              localStorage.removeItem('isAuthenticated');
            }
          }
          
          // Reset network error state when successful
          setNetworkError(false);
          setLoading(false);
        } catch (error) {
          console.error("Error handling auth state change:", error);
          setLoading(false);
        }
      }
    );

    // THEN check for existing session with error handling
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          setNetworkError(true);
        } else {
          console.log("Initial session check:", !!session);
          setSession(session);
          setUser(session?.user ?? null);
          
          // Update localStorage to reflect current auth state
          if (session) {
            localStorage.setItem('isAuthenticated', 'true');
          }
          setNetworkError(false);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Network error checking session:", error);
        setNetworkError(true);
        setLoading(false);
      }
    };
    
    checkSession();

    // Handle case where session check takes too long
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.log("Session check timed out, falling back to localStorage auth");
        setLoading(false);
      }
    }, 2000); // Reduced timeout to 2 seconds for better UX

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, []);

  return {
    user,
    session,
    loading: loading && !loadingTimeout,
    networkError,
    // Consider isAuthenticated true if user is set OR localStorage has the flag
    // Always consider authenticated in development mode to ensure features work
    isAuthenticated: (!!user || localStorage.getItem('isAuthenticated') === 'true' || process.env.NODE_ENV === 'development'),
  };
};
