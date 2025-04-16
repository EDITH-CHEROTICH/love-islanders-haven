
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import Login from '@/pages/Login';
import Profile from '@/pages/Profile'; // Changed from ProfilePage to Profile
import Discover from '@/pages/Discover';
import Verify from '@/pages/Verify';
import Settings from '@/pages/Settings';
import Feedback from '@/pages/Feedback';
import Safety from '@/pages/Safety';
import Support from '@/pages/Support';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import Signup from '@/pages/Signup';
import { Toaster as ToastContainer } from 'sonner';
import MobileNavigation from '@/components/MobileNavigation';
import useOnline from '@/hooks/useOnline';
import OfflinePlaceholder from '@/components/OfflinePlaceholder';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

// Don't forget to add the Onboarding component to your routes
import Onboarding from './pages/Onboarding';

function App() {
  const { isAuthenticated, loading, user } = useAuth();
  const online = useOnline();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!online) {
      toast({
        title: "No internet connection",
        description: "Some features may be unavailable",
        duration: 5000,
      });
    }
  }, [online, toast]);

  // Handle redirect after auth changes
  useEffect(() => {
    const redirectPath = localStorage.getItem('redirectAfterAuth');
    if (redirectPath && isAuthenticated) {
      localStorage.removeItem('redirectAfterAuth');
      navigate(redirectPath, { replace: true });
    }
    
    const shouldRedirectToLogin = localStorage.getItem('shouldRedirectToLogin');
    if (shouldRedirectToLogin === 'true' && !isAuthenticated && !loading) {
      localStorage.removeItem('shouldRedirectToLogin');
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  // Custom PrivateRoute component
  const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    
    useEffect(() => {
      if (!isAuthenticated && !loading) {
        // Redirect to login if not authenticated
        navigate('/login', { replace: true });
      }
    }, [isAuthenticated, loading, navigate]);

    // Show loading indicator while authenticating
    if (loading) {
      return (
        <div className="flex h-screen items-center justify-center bg-island-dark">
          <Loader2 className="h-12 w-12 animate-spin text-love" />
        </div>
      );
    }

    return isAuthenticated ? <>{children}</> : null;
  };

  return (
    <>
      {online ? (
        <>
          <Routes>
            <Route path="/login" element={isAuthenticated ? <Navigate to="/discover" replace /> : <Login />} />
            <Route path="/signup" element={isAuthenticated ? <Navigate to="/discover" replace /> : <Signup />} />
            <Route path="/verify" element={isAuthenticated ? <Navigate to="/discover" replace /> : <Verify />} />
            
            <Route path="/onboarding" element={<Onboarding />} />
            
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/discover"
              element={
                <PrivateRoute>
                  <Discover />
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              }
            />
            <Route
              path="/feedback"
              element={
                <PrivateRoute>
                  <Feedback />
                </PrivateRoute>
              }
            />
            <Route
              path="/safety"
              element={
                <PrivateRoute>
                  <Safety />
                </PrivateRoute>
              }
            />
            <Route
              path="/support"
              element={
                <PrivateRoute>
                  <Support />
                </PrivateRoute>
              }
            />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/" element={<Navigate to="/discover" replace />} />
          </Routes>
          
          {/* Conditionally render MobileNavigation */}
          {isAuthenticated && user && (
            <MobileNavigation />
          )}
          
          <ToastContainer />
        </>
      ) : (
        <OfflinePlaceholder />
      )}
    </>
  );
}

export default App;
