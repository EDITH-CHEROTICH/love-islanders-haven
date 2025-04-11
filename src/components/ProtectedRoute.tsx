
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
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [authenticationAttempted, setAuthenticationAttempted] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);

  console.log("ProtectedRoute - Path:", location.pathname);
  console.log("ProtectedRoute - Auth state:", { isAuthenticated, loading });
  
  // Check if user's email is verified
  useEffect(() => {
    const checkEmailVerification = async () => {
      if (!isAuthenticated || !user?.id) return;
      
      try {
        setIsVerifying(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('email_verified')
          .eq('id', user.id)
          .single();
          
        if (!error && data) {
          setIsVerified(data.email_verified === true);
          
          // If email is not verified, force verification
          if (!data.email_verified && !isEmailSubmitted) {
            // Get email from localStorage or user object
            const userEmail = user.email || localStorage.getItem('authContact');
            
            if (userEmail) {
              setEmail(userEmail);
              // Generate a new verification code
              const newCode = Math.floor(1000 + Math.random() * 9000).toString();
              setVerificationCode(newCode);
              setIsEmailSubmitted(true);
              
              // Send verification code
              await sendVerificationCode(userEmail, newCode);
            }
          }
        }
      } catch (err) {
        console.error("Error checking email verification:", err);
      } finally {
        setIsVerifying(false);
      }
    };
    
    checkEmailVerification();
  }, [isAuthenticated, user?.id]);
  
  // For development purposes, set isAuthenticated to true by default
  useEffect(() => {
    // Check localStorage for authentication status
    const localStorageAuth = localStorage.getItem('isAuthenticated') === 'true';
    const verificationCompleted = localStorage.getItem('emailVerificationCompleted') === 'true';
    
    if (localStorageAuth && !isAuthenticated && !authenticationAttempted) {
      setAuthenticationAttempted(true);
      // Try to refresh the auth state
      supabase.auth.refreshSession().then(({ data }) => {
        if (!data.session && process.env.NODE_ENV !== 'development') {
          // Don't clear localStorage in development mode
          console.log("Session refresh failed, but keeping localStorage in development mode");
        }
      });
    }
    
    // Set verified status based on localStorage in development
    if (verificationCompleted) {
      setIsVerified(true);
    }
  }, [isAuthenticated, authenticationAttempted]);
  
  const handleEmailSubmit = (email: string, code: string) => {
    setEmail(email);
    setVerificationCode(code);
    setIsEmailSubmitted(true);
  };

  const sendVerificationCode = async (email: string, code: string) => {
    setIsSendingCode(true);
    
    try {
      // Send verification code via email through Supabase function
      const { error } = await supabase.functions.invoke('send-verification-email', {
        body: { 
          email, 
          code
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast.success("Verification code sent to your email");
      console.log("Sent verification code:", code, "to", email);
      return true;
    } catch (error: any) {
      console.error("Error sending verification code:", error);
      toast.error("Failed to send verification code. Please try again.");
      return false;
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleResendCode = async () => {
    // Generate a new 4-digit code
    const newCode = Math.floor(1000 + Math.random() * 9000).toString();
    setVerificationCode(newCode);
    
    await sendVerificationCode(email, newCode);
  };

  const handleAuthSuccess = () => {
    // Reset form and reload page to reflect auth status
    setIsEmailSubmitted(false);
    setIsVerified(true);
    localStorage.setItem('emailVerificationCompleted', 'true');
    window.location.reload();
  };

  // If we're loading auth state, show a spinner
  if (loading || isVerifying) {
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

  // Authentication is confirmed, but check for email verification
  if (!isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-island-dark via-island to-island-dark pt-4 pb-20 flex flex-col items-center justify-center px-4">
        <div className="glass-card w-full max-w-md p-6 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold text-gradient text-center mb-6">
            Verify Your Email
          </h1>
          
          <VerificationForm 
            email={email}
            generatedCode={verificationCode}
            onResendCode={handleResendCode}
            isSendingCode={isSendingCode}
            onClose={handleAuthSuccess}
          />
        </div>
      </div>
    );
  }

  // User is authenticated and verified, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
