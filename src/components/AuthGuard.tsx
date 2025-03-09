
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Check if user is authenticated
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
  }, []);
  
  // Still checking authentication status
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-island-dark via-island to-island-dark pt-4 pb-20 flex items-center justify-center">
        <div className="loader w-12 h-12 border-4 border-love/20 border-t-love rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // If not authenticated, redirect to signup page
  if (!isAuthenticated && !['/signup', '/verify'].includes(location.pathname)) {
    return <Navigate to="/signup" replace />;
  }
  
  // If authenticated and trying to access auth pages, redirect to home
  if (isAuthenticated && ['/signup', '/verify'].includes(location.pathname)) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

export default AuthGuard;
