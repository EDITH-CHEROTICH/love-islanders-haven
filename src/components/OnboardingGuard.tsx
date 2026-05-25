import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
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
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (loading) {
        return;
      }

      if (!isAuthenticated || !user?.id) {
        setChecking(false);
        return;
      }

      // Don't redirect away from onboarding itself
      if (location.pathname === '/onboarding') {
        setChecking(false);
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
          if (!cancelled) {
            setChecking(false);
          }
          return;
        }

        if (!cancelled && profile && profile.onboarding_completed === false) {
          navigate('/onboarding', { replace: true });
          return;
        }
      } catch (err) {
        console.error('OnboardingGuard error:', err);
      } finally {
        if (!cancelled) setChecking(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, user?.id, loading, location.pathname, navigate]);

  if (loading || checking) {
    return (
      <div className="flex h-screen items-center justify-center bg-island-dark">
        <Loader2 className="h-12 w-12 animate-spin text-love" />
      </div>
    );
  }

  return <>{children}</>;
};

export default OnboardingGuard;
