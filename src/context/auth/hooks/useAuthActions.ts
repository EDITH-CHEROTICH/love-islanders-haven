
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { createOrUpdateProfile } from '../utils';
import { toast } from 'sonner';

export const useAuthActions = () => {
  const [loading, setLoading] = useState(false);

  const signIn = async (email: string) => {
    console.log(`Attempting to sign in with email: ${email}`);
    setLoading(true);
    
    try {
      // Instead of using OTP, we'll directly query for the user
      const { data: { users }, error: getUserError } = await supabase.auth.admin.listUsers({
        filters: {
          email: email
        }
      });
      
      if (getUserError) {
        console.error("Error checking user:", getUserError);
        throw getUserError;
      }
      
      // Check if user exists
      const userExists = users && users.length > 0;
      
      if (!userExists) {
        throw new Error("No account found with this email. Please sign up instead.");
      }
      
      // Store local authentication
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('authMethod', 'email');
      localStorage.setItem('authContact', email);
      
      return { user: users[0] };
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
      const { data: { users }, error: getUserError } = await supabase.auth.admin.listUsers({
        filters: {
          email: email
        }
      });
      
      if (getUserError) {
        console.error("Error checking user:", getUserError);
      } else if (users && users.length > 0) {
        // User already exists, just set local auth
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('authMethod', 'email');
        localStorage.setItem('authContact', email);
        return { user: users[0] };
      }
      
      // Create a new user without sending email
      const { data, error } = await supabase.auth.signUp({
        email,
        password: crypto.randomUUID(), // Generate a random password
        options: {
          emailRedirectTo: window.location.origin + '/discover',
          data: {
            email_verified: false
          }
        }
      });
      
      if (error) {
        console.error("Sign up error:", error);
        throw error;
      }
      
      console.log("User signup initiated:", data);
      
      // Set local authentication for immediate access
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('authMethod', 'email');
      localStorage.setItem('authContact', email);
      
      return data;
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
