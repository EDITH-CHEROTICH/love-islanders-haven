
import { createContext, useContext, useState, useEffect } from 'react';
import { AuthChangeEvent, Session, User } from '@supabase/supabase-js';

import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  loading: boolean;
  networkError: boolean;
  signIn: (email: string, password: string) => Promise<{
    error?: Error;
  }>;
  signUp: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [networkError, setNetworkError] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();

        setUser(session?.user ?? null);
        setSession(session ?? null);
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error("Network error:", error);
        setNetworkError(true);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null);
        setSession(session ?? null);
        setIsAuthenticated(!!session);
        setLoading(false);

        // Store redirect path in localStorage to be used after auth
        if (session && event === 'SIGNED_IN') {
          const redirectPath = localStorage.getItem('redirectAfterAuth');
          if (redirectPath) {
            // Don't remove the redirectAfterAuth here, let the component that handles 
            // navigation remove it after successful navigation
            // The actual navigation will be handled in the component that renders this redirect
            console.log('Auth state changed, redirect path:', redirectPath);
          }
        }
      }
    );

    // Unsubscribe from the subscription when the component unmounts
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      if (data.user) {
        // Check if the user should be redirected to onboarding
        const { data: onboardingData } = await supabase
          .from('profile_onboarding')
          .select('completed')
          .eq('profile_id', data.user.id)
          .single();
          
        // If onboarding doesn't exist or is not completed, redirect to onboarding
        if (!onboardingData || !onboardingData.completed) {
          localStorage.setItem('redirectAfterAuth', '/onboarding');
        } else {
          localStorage.setItem('redirectAfterAuth', '/discover');
        }
      }
      
      return {};
    } catch (error: any) {
      console.error('Sign-in error:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/verify`,
        },
      });

      if (error) {
        throw error;
      }
      
      // When successful, set redirect to onboarding instead of /profile
      if (data.user) {
        localStorage.setItem('redirectAfterAuth', '/onboarding');
      }

      // Store signup info for verification
      localStorage.setItem('authMethod', 'email');
      localStorage.setItem('authContact', email);

      // Generate a verification code (4 digits)
      const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
      localStorage.setItem('verificationCode', verificationCode);

      console.log('Verification code:', verificationCode);
      
      return true;
    } catch (error: any) {
      console.error('Sign-up error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('redirectAfterAuth');
      
      // We'll handle the actual navigation in App.tsx or other components
      localStorage.setItem('shouldRedirectToLogin', 'true');
    } catch (error: any) {
      console.error('Sign-out error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });
      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error('Password reset error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/onboarding',
        },
      });
      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    session,
    isAuthenticated,
    loading,
    networkError,
    signIn,
    signUp,
    signOut,
    resetPassword,
    signInWithGoogle,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
