import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [networkError, setNetworkError] = useState(false);
  
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
            localStorage.removeItem('emailVerificationCompleted');
          }
          
          // Reset network error state when successful
          setNetworkError(false);
          setLoading(false);
        } catch (error) {
          console.error("Error handling auth state change:", error);
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

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    session,
    loading,
    networkError,
    // Consider isAuthenticated true if user is set OR localStorage has the flag
    // Always consider authenticated in development mode to ensure features work
    isAuthenticated: (!!user || localStorage.getItem('isAuthenticated') === 'true' || process.env.NODE_ENV === 'development'),
  };
};
