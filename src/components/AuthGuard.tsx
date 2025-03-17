
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Attempt to sign in with Google when not authenticated
      const handleSignInWithGoogle = async () => {
        try {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: `${window.location.origin}/`,
            }
          });
          
          if (error) {
            toast({
              title: "Authentication Failed",
              description: error.message,
              variant: "destructive"
            });
          }
        } catch (error) {
          toast({
            title: "Authentication Failed",
            description: "Could not connect to authentication service.",
            variant: "destructive"
          });
        }
      };
      
      handleSignInWithGoogle();
    }
  }, [isAuthenticated, loading, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-love"></div>
      </div>
    );
  }

  // Skip redirecting as we're automatically attempting to authenticate
  // with Google OAuth in the useEffect above
  return <>{children}</>;
};

export default AuthGuard;
