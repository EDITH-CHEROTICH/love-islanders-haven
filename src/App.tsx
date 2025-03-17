import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Matches from "./pages/Matches";
import Streaks from "./pages/Streaks";
import UserProfile from "./pages/UserProfile";
import Verify from "./pages/Verify";
import NotFound from "./pages/NotFound";
import AICompanionChat from "./pages/AICompanionChat";
import Settings from "./pages/Settings";
import AuthGuard from "./components/AuthGuard";
import { useEffect } from "react";
import { App as CapApp } from '@capacitor/app';
import { AudioPlayerProvider } from "./hooks/use-audio-player";
import { AuthProvider } from "./context/AuthContext";
import { SettingsProvider } from "./context/SettingsContext";

const queryClient = new QueryClient();

const App = () => {
  // Add mobile-specific listeners for Capacitor
  useEffect(() => {
    // Set up hardware back button handling for capacitor
    if ('Capacitor' in window) {
      CapApp.addListener('backButton', ({ canGoBack }) => {
        if (canGoBack) {
          window.history.back();
        } else {
          CapApp.exitApp();
        }
      });
    }
    
    return () => {
      if ('Capacitor' in window) {
        CapApp.removeAllListeners();
      }
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SettingsProvider>
          <TooltipProvider>
            <AudioPlayerProvider>
              <Toaster />
              <Sonner position="top-center" theme="dark" closeButton />
              <BrowserRouter>
                <div className="mobile-app-container">
                  <Routes>
                    {/* Auth routes - accessible without authentication */}
                    <Route path="/verify" element={<Verify />} />
                    
                    {/* Protected routes - require authentication */}
                    <Route path="/" element={<AuthGuard><Index /></AuthGuard>} />
                    <Route path="/matches" element={<AuthGuard><Matches /></AuthGuard>} />
                    <Route path="/streaks" element={<AuthGuard><Streaks /></AuthGuard>} />
                    <Route path="/profile" element={<AuthGuard><UserProfile /></AuthGuard>} />
                    <Route path="/ai-companion" element={<AuthGuard><AICompanionChat /></AuthGuard>} />
                    <Route path="/settings" element={<AuthGuard><Settings /></AuthGuard>} />
                    
                    {/* 404 route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </BrowserRouter>
            </AudioPlayerProvider>
          </TooltipProvider>
        </SettingsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
