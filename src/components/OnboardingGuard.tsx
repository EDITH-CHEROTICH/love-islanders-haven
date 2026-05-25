import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';

interface OnboardingGuardProps {
  children: React.ReactNode;
}

/**
 * Ensures authenticated users with incomplete onboarding are
 * redirected to /onboarding before viewing any protected page.
 */
const OnboardingGuard = ({ children }: OnboardingGuardProps) => {
  const { isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const hasAuthenticatedUser = !!user?.id || isAuthenticated;

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (loading || !hasAuthenticatedUser || !user?.id || location.pathname === '/onboarding') {
        return;
      }

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.error('OnboardingGuard profile query error:', error);
          return;
        }

        if (!cancelled && profile && profile.onboarding_completed === false) {
          navigate('/onboarding', { replace: true });
        }
      } catch (err) {
        console.error('OnboardingGuard error:', err);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [hasAuthenticatedUser, user?.id, loading, location.pathname, navigate]);

  return <>{children}</>;
};

export default OnboardingGuard;
