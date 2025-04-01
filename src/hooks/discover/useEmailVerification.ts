
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
        // Check if verification has already been completed
        const verificationCompleted = localStorage.getItem('emailVerificationCompleted');
        
        if (verificationCompleted === 'true') {
          console.log("Email verification already completed, not showing popup");
          setShowVerificationPopup(false);
          return;
        }
        
        // Check if we have an email in localStorage
        const authContact = localStorage.getItem('authContact');
        
        if (authContact) {
          // First, get the current user ID
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user?.id) {
            // Then use the ID to query the profile
            const { data, error } = await supabase
              .from('profiles')
              .select('id')
              .eq('id', user.id);
              
            // If no profile found or query returned empty array, show verification popup
            if (!data || data.length === 0 || error) {
              setShowVerificationPopup(true);
            } else {
              // Profile exists, mark verification as completed
              localStorage.setItem('emailVerificationCompleted', 'true');
              setShowVerificationPopup(false);
            }
          } else {
            // If no user ID is available, show verification popup
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
    console.log("Email verification completed, closing popup");
    // Set verification completed in localStorage
    localStorage.setItem('emailVerificationCompleted', 'true');
    setShowVerificationPopup(false);
  };

  useEffect(() => {
    checkEmailVerification();
  }, [isAuthenticated]);

  return {
    showVerificationPopup,
    handleVerificationComplete
  };
}
