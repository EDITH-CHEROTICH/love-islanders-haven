
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAuthActions = () => {
  const [loading, setLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const auth = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return auth;
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
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            name: email.split('@')[0],
            email_verified: false,
          },
        },
      });
      
      if (error) throw error;
      
      // Return true if signup was successful
      return !!data.user;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('emailVerificationCompleted');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('authMethod');
      localStorage.removeItem('authContact');
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (password: string) => {
    setLoading(true);
    try {
      await supabase.auth.updateUser({ password });
    } finally {
      setLoading(false);
    }
  };
  
  // Function to verify email with code
  const verifyEmailWithCode = async (userId: string, email: string) => {
    setLoading(true);
    try {
      // Update user profile with verified email status
      const { error } = await supabase
        .from('profiles')
        .update({
          email: email,
          email_verified: true
        })
        .eq('id', userId);
        
      if (error) {
        console.error("Error updating email verification status:", error);
        return false;
      }
      
      // Set localStorage flags
      localStorage.setItem('emailVerificationCompleted', 'true');
      localStorage.setItem('authContact', email);
      
      return true;
    } catch (error) {
      console.error("Error verifying email with code:", error);
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
    signOut,
    updatePassword,
    verifyEmailWithCode
  };
};
