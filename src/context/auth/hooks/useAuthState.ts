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

    const ensureProfileExists = async (u: User) => {
      try {
        const { data: existing, error: selErr } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', u.id)
          .maybeSingle();

        if (selErr) {
          console.error('ensureProfileExists select error:', selErr);
          return;
        }
        if (existing) return;

        const meta: any = u.user_metadata || {};
        const name =
          meta.name ||
          meta.full_name ||
          meta.user_name ||
          (u.email ? u.email.split('@')[0] : 'New user');

        const { error: upsertErr } = await supabase.from('profiles').upsert(
          {
            id: u.id,
            email: u.email ?? null,
            name,
            display_name: name,
            email_verified: !!u.email_confirmed_at,
            onboarding_completed: false,
          },
          { onConflict: 'id' },
        );
        if (upsertErr) {
          console.error('ensureProfileExists upsert error:', upsertErr);
          return;
        }

        await supabase.from('profile_onboarding').upsert(
          { profile_id: u.id, completed: false, current_step: 'basics' },
          { onConflict: 'profile_id' },
        );
      } catch (err) {
        console.error('ensureProfileExists exception:', err);
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

      // Fire-and-forget: make sure a profile row exists (covers Google OAuth users).
      void ensureProfileExists(nextSession.user).then(() => {
        if (!isMounted) return;
        void checkEmailVerification(nextSession.user!.id).then((verified) => {
          if (!isMounted) return;
          setEmailVerified(verified);
          if (verified) {
            localStorage.setItem('emailVerificationCompleted', 'true');
          } else {
            localStorage.removeItem('emailVerificationCompleted');
          }
        });
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
