
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { createOrUpdateProfile } from './utils';

export const useAuthState = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLocalAuth, setIsLocalAuth] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    console.log("AuthProvider initialization");
    
    // Check for localStorage authentication first
    const localAuth = localStorage.getItem('isAuthenticated');
    
    if (localAuth === 'true') {
      console.log("Local authentication found");
      setIsLocalAuth(true);
      
      // Get additional user info if available
      const authMethod = localStorage.getItem('authMethod');
      const authContact = localStorage.getItem('authContact');
      console.log(`Local auth details - Method: ${authMethod}, Contact: ${authContact}`);
    }

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          console.log("User signed in or token refreshed, setting session");
          setSession(session);
          setUser(session?.user ?? null);
          
          // If signed in, store local backup
          if (session?.user) {
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('authMethod', 'supabase');
            localStorage.setItem('authContact', session.user.email || '');
            setIsLocalAuth(true);
            console.log("User signed in - setting localStorage backup");
          }
        }
        
        // If signed out, clear local backup
        if (event === 'SIGNED_OUT') {
          console.log("User signed out - clearing state and localStorage");
          setSession(null);
          setUser(null);
          localStorage.removeItem('isAuthenticated');
          localStorage.removeItem('authMethod');
          localStorage.removeItem('authContact');
          setIsLocalAuth(false);
          
          const url = new URL(window.location.href);
          const error = url.searchParams.get('error');
          const errorDescription = url.searchParams.get('error_description');
          
          if (error) {
            toast({
              title: "Authentication Error",
              description: errorDescription || "There was a problem with authentication",
              variant: "destructive",
            });
            
            // Clean the URL of error parameters
            url.searchParams.delete('error');
            url.searchParams.delete('error_code');
            url.searchParams.delete('error_description');
            window.history.replaceState({}, document.title, url.toString());
          }
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Existing session check:", session ? "Found" : "Not found");
      
      if (session) {
        console.log("Valid session found - updating state and localStorage backup");
        setSession(session);
        setUser(session.user);
        
        // If there's a valid session, update local storage backup
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('authMethod', 'supabase');
        localStorage.setItem('authContact', session.user.email || '');
        setIsLocalAuth(true);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const signIn = async (email: string, password: string) => {
    console.log(`Attempting to sign in with email: ${email}`);
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error("Sign in error:", error);
        throw error;
      }
      
      console.log("Sign in successful:", data);
      
      // Store local authentication as a fallback
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('authMethod', 'email');
      localStorage.setItem('authContact', email);
      setIsLocalAuth(true);
      
      // Update session and user state
      setSession(data.session);
      setUser(data.user);
      
      return data;
    } catch (error) {
      setLoading(false);
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
  };

  const signUp = async (email: string, password: string) => {
    console.log(`Attempting to sign up with email: ${email}`);
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/discover`,
          data: {
            email: email, // Store email in user metadata
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
      
      // For development environments where email verification might be disabled
      // This will set the user as authenticated immediately after sign up
      if (data.user) {
        // Set session and user state directly after signup
        setSession(data.session);
        setUser(data.user);
        
        // Set local authentication for immediate access
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('authMethod', 'email');
        localStorage.setItem('authContact', email);
        setIsLocalAuth(true);
      }
    } catch (error) {
      setLoading(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    
    if (error) throw error;
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
      setIsLocalAuth(false);
      
      // Then sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out from Supabase:", error);
        throw error;
      }
      
      // Update state
      setSession(null);
      setUser(null);
      console.log("User signed out successfully");
    } finally {
      setLoading(false);
    }
  };

  return {
    session,
    user,
    loading,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    resetPassword,
    isAuthenticated: !!user || isLocalAuth
  };
};
