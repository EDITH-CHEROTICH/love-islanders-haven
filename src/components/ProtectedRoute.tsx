
import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import EmailAuthForm from './auth/EmailAuthForm';
import VerificationForm from './auth/VerificationForm';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [authenticationAttempted, setAuthenticationAttempted] = useState(false);

  console.log("ProtectedRoute - Path:", location.pathname);
  console.log("ProtectedRoute - Auth state:", { isAuthenticated, loading });
  
  // For development purposes, set isAuthenticated to true by default
  useEffect(() => {
    // If no auth status in localStorage yet, default to authenticated for easier development
    if (localStorage.getItem('isAuthenticated') === null) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('emailVerificationCompleted', 'true');
    }
    
    // Check localStorage for authentication status
    const localStorageAuth = localStorage.getItem('isAuthenticated') === 'true';
    const verificationCompleted = localStorage.getItem('emailVerificationCompleted') === 'true';
    
    if (localStorageAuth && verificationCompleted && !isAuthenticated && !authenticationAttempted) {
      setAuthenticationAttempted(true);
      // Try to refresh the auth state
      supabase.auth.refreshSession().then(({ data }) => {
        if (!data.session) {
          // Don't clear localStorage in development mode to enable easier testing
          // localStorage.removeItem('isAuthenticated');
          // localStorage.removeItem('emailVerificationCompleted');
          // toast.error("Your session has expired. Please sign in again.");
        }
      });
    }
  }, [isAuthenticated, authenticationAttempted]);
  
  const handleEmailSubmit = (email: string, code: string) => {
    setEmail(email);
    setVerificationCode(code);
    setIsEmailSubmitted(true);
  };

  const handleResendCode = async () => {
    setIsSendingCode(true);
    
    try {
      // Generate a new 4-digit code
      const newCode = Math.floor(1000 + Math.random() * 9000).toString();
      setVerificationCode(newCode);
      
      // Send verification code via email through Supabase function
      const { error } = await supabase.functions.invoke('send-verification-email', {
        body: { 
          email, 
          code: newCode 
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast.success("New verification code sent to your email");
      console.log("Resent verification code:", newCode);
    } catch (error: any) {
      console.error("Error resending verification code:", error);
      toast.error("Failed to send verification code. Please try again.");
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleAuthSuccess = () => {
    // Reset form and reload page to reflect auth status
    setIsEmailSubmitted(false);
    window.location.reload();
  };

  // If we're loading auth state, show a spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-island-dark via-island to-island-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-love"></div>
      </div>
    );
  }

  // Consider both auth methods: context state and localStorage
  const effectivelyAuthenticated = isAuthenticated || localStorage.getItem('isAuthenticated') === 'true';

  // If not authenticated, show in-line auth form
  if (!effectivelyAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-island-dark via-island to-island-dark pt-4 pb-20 flex flex-col items-center justify-center px-4">
        <div className="glass-card w-full max-w-md p-6 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold text-gradient text-center mb-6">
            {isEmailSubmitted ? "Verify Your Email" : "Sign In / Sign Up"}
          </h1>
          
          {isEmailSubmitted ? (
            <VerificationForm 
              email={email}
              generatedCode={verificationCode}
              onResendCode={handleResendCode}
              isSendingCode={isSendingCode}
              onClose={handleAuthSuccess}
            />
          ) : (
            <EmailAuthForm onEmailSubmit={handleEmailSubmit} />
          )}
        </div>
      </div>
    );
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
