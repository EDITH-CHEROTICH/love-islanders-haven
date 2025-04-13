
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: options?.metadata || {},
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
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
  };
};
