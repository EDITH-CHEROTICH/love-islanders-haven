
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { createOrUpdateProfile } from '../utils';
import { toast } from 'sonner';

export const useAuthActions = () => {
  const [loading, setLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    console.log(`Attempting to sign in with email: ${email}`);
    setLoading(true);
    
    try {
      // Attempt to sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Sign in error:", error);
        throw error;
      }
      
      console.log("Sign in successful:", data);
      
      // Store local authentication as a fallback
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('authMethod', 'email');
      localStorage.setItem('authContact', email);
      
      return data;
    } catch (error) {
      console.error("Error during sign in:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    const currentUrl = window.location.origin;
    
    // Generate a random state parameter to prevent CSRF attacks
    const stateParam = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('oauth_state', stateParam);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${currentUrl}/discover`,
          queryParams: {
            prompt: 'select_account',
            state: stateParam
          }
        }
      });
      
      if (error) throw error;
    } catch (error) {
      console.error("Error during Google sign in:", error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    console.log(`Attempting to sign up with email: ${email}`);
    setLoading(true);
    
    try {
      // Using signUp with email confirmation disabled
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/discover`,
          data: {
            email: email,
          }
        }
      });
      
      if (error) {
        console.error("Sign up error:", error);
        throw error;
      }
      
      console.log("Sign up successful:", data);
      
      // Check if we need to create or update a profile for this user
      if (data.user) {
        await createOrUpdateProfile(data.user.id, email);
      }
      
      // Set local authentication for immediate access
      if (data.user) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('authMethod', 'email');
        localStorage.setItem('authContact', email);
      }
      
      return data;
    } catch (error) {
      console.error("Error during sign up:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
      
      if (error) throw error;
    } catch (error) {
      console.error("Error during password reset:", error);
      throw error;
    }
  };

  const signOut = async () => {
    console.log("Signing out user");
    setLoading(true);
    
    try {
      // First, clear localStorage
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('authMethod');
      localStorage.removeItem('authContact');
      localStorage.removeItem('oauth_state');
      
      // Then sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out from Supabase:", error);
        throw error;
      }
      
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Error during sign out:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (newPassword: string) => {
    console.log("Attempting to update password");
    setLoading(true);
    
    try {
      // Get current session first to ensure we're authenticated
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        console.error("No active session found when updating password");
        toast("Authentication error: No active session found", {
          description: "Please try logging in again",
        });
        throw new Error("Auth session missing!");
      }
      
      console.log("Session confirmed, updating password");
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      
      if (error) {
        console.error("Error updating password:", error);
        throw error;
      }
      
      console.log("Password updated successfully");
      return true;
    } catch (error) {
      console.error("Password update error:", error);
      throw error;
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
    updatePassword
  };
};
