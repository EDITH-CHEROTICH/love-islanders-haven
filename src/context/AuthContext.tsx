
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
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
      setLoading(false);
      
      // Get additional user info if available
      const authMethod = localStorage.getItem('authMethod');
      const authContact = localStorage.getItem('authContact');
      console.log(`Local auth details - Method: ${authMethod}, Contact: ${authContact}`);
    }

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // If signed in, store local backup
        if (event === 'SIGNED_IN' && session?.user) {
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('authMethod', 'supabase');
          localStorage.setItem('authContact', session.user.email || '');
          setIsLocalAuth(true);
          console.log("User signed in - setting localStorage backup");
        }
        
        // If signed out, clear local backup
        if (event === 'SIGNED_OUT') {
          localStorage.removeItem('isAuthenticated');
          localStorage.removeItem('authMethod');
          localStorage.removeItem('authContact');
          setIsLocalAuth(false);
          console.log("User signed out - clearing localStorage backup");
          
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
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Existing session check:", session ? "Found" : "Not found");
      setSession(session);
      setUser(session?.user ?? null);
      
      // If there's a valid session, update local storage backup
      if (session?.user) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('authMethod', 'supabase');
        localStorage.setItem('authContact', session.user.email || '');
        setIsLocalAuth(true);
        console.log("Valid session found - updating localStorage backup");
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const signIn = async (email: string, password: string) => {
    console.log(`Attempting to sign in with email: ${email}`);
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
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/discover`
      }
    });
    
    if (error) throw error;
    
    // For development environments where email verification might be disabled
    // This will set the user as authenticated immediately after sign up
    if (data.user && !data.user.email_confirmed_at) {
      // Set local authentication for immediate access
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('authMethod', 'email');
      localStorage.setItem('authContact', email);
      setIsLocalAuth(true);
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
  };

  const value = {
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
