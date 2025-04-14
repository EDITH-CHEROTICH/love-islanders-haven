
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [networkError, setNetworkError] = useState(false);
  const [emailVerified, setEmailVerified] = useState<boolean | null>(null);

  useEffect(() => {
    // Function to check if the email is verified
    const checkEmailVerification = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('email_verified')
          .eq('id', userId)
          .single();

        if (error) {
          console.error("Error checking email verification:", error);
          return null;
        }

        return data?.email_verified;
      } catch (error) {
        console.error("Error checking email verification:", error);
        return null;
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state changed:", event, newSession?.user?.id);
        
        setUser(newSession?.user ?? null);
        setSession(newSession);
        
        if (newSession?.user) {
          // Check if email is verified when session changes
          const verified = await checkEmailVerification(newSession.user.id);
          setEmailVerified(verified);
          
          // Store authentication status in localStorage
          if (verified) {
            localStorage.setItem('emailVerificationCompleted', 'true');
            if (newSession?.user?.email) {
              localStorage.setItem('authContact', newSession.user.email);
            }
          }
          
          localStorage.setItem('isAuthenticated', 'true');
        } else {
          setEmailVerified(null);
        }
      }
    );

    // Check for existing session
    const initializeAuthState = async () => {
      try {
        setLoading(true);
        
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        
        setUser(existingSession?.user ?? null);
        setSession(existingSession);
        
        if (existingSession?.user) {
          // Check if email is verified
          const verified = await checkEmailVerification(existingSession.user.id);
          setEmailVerified(verified);
          
          // Store authentication status in localStorage
          localStorage.setItem('isAuthenticated', 'true');
          if (verified) {
            localStorage.setItem('emailVerificationCompleted', 'true');
          }
          if (existingSession?.user?.email) {
            localStorage.setItem('authContact', existingSession.user.email);
          }
        } else {
          // Check if we have authentication in localStorage from hybrid flow
          const isLocallyAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
          if (isLocallyAuthenticated) {
            const isLocallyVerified = localStorage.getItem('emailVerificationCompleted') === 'true';
            setEmailVerified(isLocallyVerified);
          }
        }
        
        setNetworkError(false);
      } catch (error) {
        console.error("Error initializing auth state:", error);
        setNetworkError(true);
        
        // Check if we have authentication in localStorage as fallback
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        const isVerified = localStorage.getItem('emailVerificationCompleted') === 'true';
        
        if (isAuthenticated) {
          setEmailVerified(isVerified);
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuthState();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Determine if the user is authenticated based on session or localStorage fallback
  const isAuthenticated = !!user || localStorage.getItem('isAuthenticated') === 'true';

  return {
    user,
    session,
    loading,
    isAuthenticated,
    networkError,
    emailVerified
  };
};
