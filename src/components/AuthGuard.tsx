
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
    const url = new URL(window.location.href);
    
    // Check for OAuth error parameters
    const error = url.searchParams.get('error');
    const errorDescription = url.searchParams.get('error_description');
    
    if (error) {
      toast({
        title: "Authentication Error",
        description: errorDescription || "There was a problem with authentication",
        variant: "destructive",
      });
      
      // Clean the URL of error parameters and redirect to login
      url.searchParams.delete('error');
      url.searchParams.delete('error_code');
      url.searchParams.delete('error_description');
      window.history.replaceState({}, document.title, url.toString());
      
      if (!isAuthenticated) {
        navigate('/login', { replace: true });
      }
    }
    // Handle successful authentication redirect
    else if ((hash && hash.includes('access_token')) || isAuthenticated) {
      // Clear the hash and navigate to the home page
      if (hash) {
        window.history.replaceState(null, '', window.location.pathname);
      }
      
      // If we're not already on the main page, redirect there
      if (location.pathname === '/login') {
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, navigate, location.pathname, toast]);

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
