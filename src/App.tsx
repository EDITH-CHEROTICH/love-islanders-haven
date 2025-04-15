
import React, { useEffect } from 'react';
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import Login from '@/pages/Login';
import ProfilePage from '@/pages/ProfilePage';
import Discover from '@/pages/Discover';
import Verify from '@/pages/Verify';
import Settings from '@/pages/Settings';
import Feedback from '@/pages/Feedback';
import Safety from '@/pages/Safety';
import Support from '@/pages/Support';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import Signup from '@/pages/Signup';
import { Toaster } from 'sonner';
import MobileNavigation from '@/components/MobileNavigation';
import useOnline from '@/hooks/useOnline';
import OfflinePlaceholder from '@/components/OfflinePlaceholder';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import ProtectedRoute from './components/ProtectedRoute';

// Don't forget to add the Onboarding component to your routes
import Onboarding from './pages/Onboarding';

function App() {
  const { isAuthenticated, loading, user } = useAuth();
  const online = useOnline();
  const { toast } = useToast();
  
  useEffect(() => {
    if (!online) {
      toast({
        title: "No internet connection",
        description: "Some features may be unavailable",
        duration: 5000,
      })
    }
  }, [online, toast]);

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
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/discover"
              element={
                <ProtectedRoute>
                  <Discover />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/feedback"
              element={
                <ProtectedRoute>
                  <Feedback />
                </ProtectedRoute>
              }
            />
            <Route
              path="/safety"
              element={
                <ProtectedRoute>
                  <Safety />
                </ProtectedRoute>
              }
            />
            <Route
              path="/support"
              element={
                <ProtectedRoute>
                  <Support />
                </ProtectedRoute>
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
          
          <Toaster />
        </>
      ) : (
        <OfflinePlaceholder />
      )}
    </>
  );
}

export default App;
