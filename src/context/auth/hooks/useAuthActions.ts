
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { updateEmailVerificationStatus } from '@/services/profiles/verification';

export const useAuthActions = () => {
  const [loading, setLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await supabase.auth.signInWithPassword({ email, password });
      return result;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, options?: any) => {
    setLoading(true);
    try {
      // If no password provided, just handle as email verification only
      if (!password && email) {
        // Create a temporary session based on email only
        localStorage.setItem('authContact', email);
        localStorage.setItem('isAuthenticated', 'true');
        return true;
      }
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: options?.metadata || {},
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (!error) {
        try {
          // Create initial profile if sign up is successful
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { error: profileError } = await supabase
              .from('profiles')
              .upsert({
                id: user.id,
                name: email.split('@')[0], // Default name from email
                email_verified: true, // Mark as verified since we're verifying with code
                gender_preference: 'both',
                relationship_goal: 'both'
              });
              
            if (profileError) {
              console.error("Error creating initial profile:", profileError);
            }
          }
        } catch (profileError) {
          console.error("Error setting up initial profile:", profileError);
        }
      }
      
      // Return boolean to match our AuthContextType
      return !error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) {
        throw error;
      }
      // Return void to match our AuthContextType
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (password: string): Promise<void> => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        throw error;
      }
      // Return void to match our AuthContextType
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      // Clear local storage authentication data
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('authContact');
      localStorage.removeItem('emailVerificationCompleted');
    } finally {
      setLoading(false);
    }
  };

  // New method to verify email
  const verifyEmailWithCode = async (userId: string, email: string): Promise<boolean> => {
    setLoading(true);
    try {
      // Update email verification status
      const { error } = await updateEmailVerificationStatus(userId, true);
      
      if (error) {
        console.error("Error updating email verification status:", error);
        return false;
      }
      
      localStorage.setItem('emailVerificationCompleted', 'true');
      return true;
    } catch (error) {
      console.error("Error verifying email:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    signIn,
    signInWithGoogle,
    signUp,
    resetPassword,
    updatePassword,
    signOut,
    verifyEmailWithCode,
  };
};
