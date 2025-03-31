
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
  const { isAuthenticated } = useAuth();

  const checkEmailVerification = async () => {
    // First check if user is authenticated
    if (isAuthenticated) {
      try {
        // Check if we have an email in localStorage
        const authContact = localStorage.getItem('authContact');
        
        if (authContact) {
          // Using a different approach to avoid type inference issues
          const { data, error } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', supabase.auth.getUser().then(res => res.data.user?.id));
          
          // If no profile found or query returned empty array, show verification popup
          if (!data || data.length === 0 || error) {
            setShowVerificationPopup(true);
          }
        } else {
          // If no email in localStorage, show verification popup
          setShowVerificationPopup(true);
        }
      } catch (error) {
        console.error('Error checking email verification:', error);
      }
    }
  };

  const handleVerificationComplete = () => {
    setShowVerificationPopup(false);
    // Reload the page to refresh the authentication state
    window.location.reload();
  };

  useEffect(() => {
    checkEmailVerification();
  }, [isAuthenticated]);

  return {
    showVerificationPopup,
    handleVerificationComplete
  };
}
