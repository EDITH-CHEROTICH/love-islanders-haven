
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import EmailAuthForm from './auth/EmailAuthForm';
import VerificationForm from './auth/VerificationForm';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading, user, emailVerified } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  console.log("ProtectedRoute - Path:", location.pathname);
  console.log("ProtectedRoute - Auth state:", { isAuthenticated, loading, emailVerified });
  
  // Add a timeout to detect stuck loading states
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoadingTimeout(true);
        console.log("Loading timeout detected");
      }, 5000); // Set a reasonable timeout (5 seconds)
      
      return () => clearTimeout(timer);
    } else {
      setLoadingTimeout(false);
    }
  }, [loading]);

  const handleEmailSubmit = async (email: string, code: string) => {
    console.log("Email submitted:", email, "Code:", code);
    setEmail(email);
    setVerificationCode(code);
    setIsEmailSubmitted(true);
  };

  const sendVerificationCode = async (email: string, code: string) => {
    setIsSendingCode(true);
    
    try {
      console.log("Sending verification code to:", email);
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
    localStorage.setItem('emailVerificationCompleted', 'true');
    
    // Force reload to ensure auth state is updated everywhere
    window.location.reload();
  };

  // If we're loading auth state, show a spinner
  if (loading && !loadingTimeout) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-island-dark via-island to-island-dark">
        <Spinner className="h-12 w-12 text-love" />
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
  if (emailVerified === false) {
    console.log("Showing verification form because user is not verified");
    
    // If we have an email in localStorage or user object, use it
    const userEmail = user?.email || localStorage.getItem('authContact') || '';
    
    // If we don't have an email yet, we need to show the email form
    if (!isEmailSubmitted && !email && userEmail) {
      // If we have an email but haven't sent a code yet, generate one and send it
      const newCode = Math.floor(1000 + Math.random() * 9000).toString();
      setEmail(userEmail);
      setVerificationCode(newCode);
      setIsEmailSubmitted(true);
      // Send the verification code in the background
      sendVerificationCode(userEmail, newCode);
    }
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-island-dark via-island to-island-dark pt-4 pb-20 flex flex-col items-center justify-center px-4">
        <div className="glass-card w-full max-w-md p-6 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold text-gradient text-center mb-6">
            Verify Your Email
          </h1>
          
          {!isEmailSubmitted ? (
            <EmailAuthForm onEmailSubmit={handleEmailSubmit} />
          ) : (
            <VerificationForm 
              email={email}
              generatedCode={verificationCode}
              onResendCode={handleResendCode}
              isSendingCode={isSendingCode}
              onClose={handleAuthSuccess}
            />
          )}
        </div>
      </div>
    );
  }

  console.log("User is authenticated and verified, showing content");
  // User is authenticated and verified
  return <>{children}</>;
};

export default ProtectedRoute;
