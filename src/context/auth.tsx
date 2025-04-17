
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

        // Check if we need to redirect to onboarding
        if (session && event === 'SIGNED_IN') {
          try {
            const { data: onboardingData } = await supabase
              .from('profile_onboarding')
              .select('completed')
              .eq('profile_id', session.user.id)
              .single();
              
            if (!onboardingData || !onboardingData.completed) {
              // Create onboarding record if it doesn't exist
              if (!onboardingData) {
                await supabase
                  .from('profile_onboarding')
                  .insert({ 
                    profile_id: session.user.id,
                    completed: false,
                    current_step: 'basics'
                  });
              }
            }
          } catch (error) {
            console.error("Error checking onboarding status:", error);
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
      
      // For passwordless auth or if using verification code system
      let signUpResult;
      if (!password) {
        signUpResult = await supabase.auth.signInWithOtp({
          email,
          options: {
            shouldCreateUser: true
          }
        });
      } else {
        signUpResult = await supabase.auth.signUp({
          email,
          password,
        });
      }
      
      const { data, error } = signUpResult;

      if (error) {
        console.error("Signup error:", error);
        throw error;
      }
      
      // Create a profile if user was created
      if (data.user) {
        try {
          // Check if profile already exists
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', data.user.id)
            .maybeSingle();
            
          if (!existingProfile) {
            // Create profile
            await supabase
              .from('profiles')
              .insert({
                id: data.user.id,
                email: email,
                name: email.split('@')[0],
                email_verified: true
              });
          }
          
          // Create onboarding entry
          await supabase
            .from('profile_onboarding')
            .insert({
              profile_id: data.user.id,
              completed: false,
              current_step: 'basics'
            })
            .onConflict('profile_id')
            .ignore();
            
        } catch (profileError) {
          console.error("Error creating profile:", profileError);
        }
      }
      
      // Set auth in localStorage
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('authMethod', 'email');
      localStorage.setItem('authContact', email);
      
      return !!data.user;
    } catch (error: any) {
      console.error('Sign-up error:', error);
      throw error;
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

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated,
        loading,
        networkError,
        signIn,
        signUp,
        signOut,
        resetPassword,
        signInWithGoogle
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
