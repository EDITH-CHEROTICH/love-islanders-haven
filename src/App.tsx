
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/auth';

import Login from '@/pages/Login';
import Profile from '@/pages/Profile';
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
import Streaks from '@/pages/Streaks';
import Matches from '@/pages/Matches';
import Onboarding from './pages/Onboarding';
import AICompanion from '@/components/companion/AICompanion';
import OnboardingGuard from '@/components/OnboardingGuard';

function App() {
  const { isAuthenticated, loading, user } = useAuth();
  const online = useOnline();
  const location = useLocation();
  const { toast } = useToast();
  
  useEffect(() => {
    if (!online) {
      toast({
        title: "No internet connection",
        description: "Some features may be unavailable",
        duration: 5000,
      });
    }
  }, [online, toast]);

  // Custom PrivateRoute component
  const PrivateRoute = ({ children, guardOnboarding = true }: { children: React.ReactNode; guardOnboarding?: boolean }) => {
    const hasAuthenticatedUser = !!user?.id || isAuthenticated;

    if (loading && !hasAuthenticatedUser) {
      return (
        <div className="flex h-screen items-center justify-center bg-island-dark">
          <Loader2 className="h-12 w-12 animate-spin text-love" />
        </div>
      );
    }

    if (!hasAuthenticatedUser) {
      return <Navigate to="/login" replace />;
    }

    return guardOnboarding ? <OnboardingGuard>{children}</OnboardingGuard> : <>{children}</>;
  };

  return (
    <>
      {online ? (
        <>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify" element={<Verify />} />
            
            <Route
              path="/onboarding"
              element={
                <PrivateRoute guardOnboarding={false}>
                  <Onboarding />
                </PrivateRoute>
              }
            />
            
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
              path="/matches"
              element={
                <PrivateRoute>
                  <Matches />
                </PrivateRoute>
              }
            />
            <Route
              path="/ai-companion"
              element={
                <PrivateRoute>
                  <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 pb-20">
                    <AICompanion />
                  </div>
                </PrivateRoute>
              }
            />
            <Route
              path="/streaks"
              element={
                <PrivateRoute>
                  <Streaks />
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
          
          {/* Hide MobileNavigation on onboarding */}
          {isAuthenticated && user && location.pathname !== '/onboarding' && (
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
