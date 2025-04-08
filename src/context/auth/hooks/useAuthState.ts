
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check for values in localStorage
    const localStorageAuth = localStorage.getItem('isAuthenticated') === 'true';
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, !!session);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Update localStorage to reflect current auth state
        if (session) {
          localStorage.setItem('isAuthenticated', 'true');
        } else if (event === 'SIGNED_OUT') {
          localStorage.removeItem('isAuthenticated');
          localStorage.removeItem('emailVerificationCompleted');
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", !!session);
      setSession(session);
      setUser(session?.user ?? null);
      
      // Update localStorage to reflect current auth state
      if (session) {
        localStorage.setItem('isAuthenticated', 'true');
      } else if (!session && !localStorageAuth) {
        localStorage.removeItem('isAuthenticated');
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    session,
    loading,
    isAuthenticated: !!user || (localStorage.getItem('isAuthenticated') === 'true'), // Also check localStorage as fallback
  };
};
