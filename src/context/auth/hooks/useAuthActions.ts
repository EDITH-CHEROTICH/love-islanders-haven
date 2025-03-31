
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { createOrUpdateProfile } from '../utils';
import { toast } from 'sonner';

interface ProfileQueryResult {
  data: { id: string } | null;
  error: any;
}

export const useAuthActions = () => {
  const [loading, setLoading] = useState(false);

  const signIn = async (email: string) => {
    console.log(`Attempting to sign in with email: ${email}`);
    setLoading(true);
    
    try {
      // Check if user exists by querying for users with the email
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single() as unknown as ProfileQueryResult;
      
      if (error) {
        console.error("Error checking user:", error);
        throw new Error("No account found with this email. Please sign up instead.");
      }
      
      // Store local authentication
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('authMethod', 'email');
      localStorage.setItem('authContact', email);
      
      return { user: { id: data.id } };
    } catch (error) {
      console.error("Error during sign in:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    // This function is kept for compatibility but will not be used
    console.log("Google sign-in is disabled");
    throw new Error("Google sign-in is disabled");
  };

  const signUp = async (email: string) => {
    console.log(`Attempting to sign up with email: ${email}`);
    setLoading(true);
    
    try {
      // Check if user already exists
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle() as unknown as ProfileQueryResult;
      
      if (error) {
        console.error("Error checking user:", error);
      } else if (data) {
        // User already exists, just set local auth
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('authMethod', 'email');
        localStorage.setItem('authContact', email);
        return { user: { id: data.id } };
      }
      
      // Create a new user without sending email
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password: crypto.randomUUID(), // Generate a random password
        options: {
          emailRedirectTo: window.location.origin + '/discover',
          data: {
            email_verified: false
          }
        }
      });
      
      if (signUpError) {
        console.error("Sign up error:", signUpError);
        throw signUpError;
      }
      
      console.log("User signup initiated:", authData);
      
      // Set local authentication for immediate access
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('authMethod', 'email');
      localStorage.setItem('authContact', email);
      
      return authData;
    } catch (error) {
      console.error("Error during sign up:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // This is a placeholder for compatibility
  const resetPassword = async (email: string) => {
    console.log(`Sending reset link to: ${email}`);
    return Promise.resolve();
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
    console.log("Password updates not supported in passwordless auth");
    toast("Not available with passwordless authentication", {
      description: "Password updates are not available with passwordless authentication.",
    });
    return false;
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
