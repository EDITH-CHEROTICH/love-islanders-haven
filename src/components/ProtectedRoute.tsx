
import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("ProtectedRoute - Path:", location.pathname);
    console.log("ProtectedRoute - Auth state:", { isAuthenticated, loading });
    
    // If user becomes authenticated while on this route, and this is a protected route
    // we don't need a redirect since they're already where they need to be
  }, [location.pathname, isAuthenticated, loading, navigate]);

  // If we're loading auth state, show a spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-island-dark via-island to-island-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-love"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login with the current location
  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to login from:", location.pathname);
    // Pass the current location so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
