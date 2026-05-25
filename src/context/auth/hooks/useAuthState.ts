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
    let isMounted = true;

    const checkEmailVerification = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('email_verified')
          .eq('id', userId)
          .maybeSingle();

        if (error) {
          console.error('Error checking email verification:', error);
          return null;
        }

        return data?.email_verified ?? null;
      } catch (error) {
        console.error('Error checking email verification:', error);
        return null;
      }
    };

    const applySessionState = (nextSession: Session | null) => {
      if (!isMounted) return;

      setUser(nextSession?.user ?? null);
      setSession(nextSession);

      if (!nextSession?.user) {
        setEmailVerified(null);
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('authContact');
        localStorage.removeItem('emailVerificationCompleted');
        return;
      }

      localStorage.setItem('isAuthenticated', 'true');
      if (nextSession.user.email) {
        localStorage.setItem('authContact', nextSession.user.email);
      }

      void checkEmailVerification(nextSession.user.id).then((verified) => {
        if (!isMounted) return;

        setEmailVerified(verified);
        if (verified) {
          localStorage.setItem('emailVerificationCompleted', 'true');
        } else {
          localStorage.removeItem('emailVerificationCompleted');
        }
      });
    };

    const initializeAuthState = async () => {
      try {
        setLoading(true);
        const {
          data: { session: existingSession },
        } = await supabase.auth.getSession();

        applySessionState(existingSession);
        if (isMounted) {
          setNetworkError(false);
        }
      } catch (error) {
        console.error('Error initializing auth state:', error);
        if (isMounted) {
          setNetworkError(true);
          applySessionState(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      applySessionState(nextSession);
      if (isMounted) {
        setNetworkError(false);
        setLoading(false);
      }
    });

    void initializeAuthState();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const isAuthenticated = !!session?.user;

  return {
    user,
    session,
    loading,
    isAuthenticated,
    networkError,
    emailVerified,
  };
};
