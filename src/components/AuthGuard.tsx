
import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Handle the redirect from OAuth providers
  useEffect(() => {
    // Check if we have a hash fragment that could indicate a callback from OAuth
    const hash = window.location.hash;
    if (hash && hash.includes('access_token') && isAuthenticated) {
      // Clear the hash and navigate to the home page
      window.history.replaceState(null, '', window.location.pathname);
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-love"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Display a toast only when user is kicked out from a page, not on initial load
    if (location.pathname !== '/login' && location.key) {
      toast({
        title: "Authentication required",
        description: "Please log in to access this page",
        variant: "destructive",
      });
    }
    
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
