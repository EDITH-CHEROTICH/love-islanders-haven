
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/auth';
import { toast } from 'sonner';

interface ProfileCheck {
  id: string;
  email: string;
}

export function useEmailVerification() {
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);
  const { user } = useAuth();
  const userId = user?.id;

  const handleVerificationComplete = () => {
    localStorage.setItem('emailVerificationCompleted', 'true');
    setShowVerificationPopup(false);
  };

  useEffect(() => {
    if (!userId) return;

    // Skip entirely if already verified — no log spam on auth heartbeats
    if (localStorage.getItem('emailVerificationCompleted') === 'true') {
      setShowVerificationPopup(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, email_verified')
          .eq('id', userId)
          .maybeSingle();

        if (cancelled) return;

        if (error || !data) {
          setShowVerificationPopup(true);
          return;
        }

        if (data.email_verified) {
          localStorage.setItem('emailVerificationCompleted', 'true');
          setShowVerificationPopup(false);
        } else {
          setShowVerificationPopup(true);
        }
      } catch (err) {
        console.error('Error checking email verification:', err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return {
    showVerificationPopup,
    handleVerificationComplete,
  };
}
