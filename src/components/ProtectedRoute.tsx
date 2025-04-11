
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
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  console.log("ProtectedRoute - Path:", location.pathname);
  console.log("ProtectedRoute - Auth state:", { isAuthenticated, loading });
  
  // Add a timeout to detect stuck loading states
  useEffect(() => {
    if (loading || isVerifying) {
      const timer = setTimeout(() => {
        setLoadingTimeout(true);
        console.log("Loading timeout detected");
      }, 5000); // Set a reasonable timeout (5 seconds)
      
      return () => clearTimeout(timer);
    } else {
      setLoadingTimeout(false);
    }
  }, [loading, isVerifying]);

  // Check if user's email is verified
  useEffect(() => {
    const checkEmailVerification = async () => {
      if (!isAuthenticated || !user?.id) {
        setIsVerifying(false);
        return;
      }
      
      try {
        setIsVerifying(true);
        // First check localStorage
        const verificationCompleted = localStorage.getItem('emailVerificationCompleted') === 'true';
        
        if (verificationCompleted) {
          console.log("Email verification found in localStorage");
          setIsVerified(true);
          setIsVerifying(false);
          return;
        }
        
        console.log("Checking DB for email verification status");
        const { data, error } = await supabase
          .from('profiles')
          .select('email_verified')
          .eq('id', user.id)
          .single();
          
        if (!error && data) {
          console.log("Email verification status from DB:", data.email_verified);
          setIsVerified(data.email_verified === true);
          
          // Also update localStorage for future checks
          if (data.email_verified) {
            localStorage.setItem('emailVerificationCompleted', 'true');
          }
          
          // If email is not verified, prepare for verification
          if (!data.email_verified && !isEmailSubmitted) {
            // Get email from localStorage or user object
            const userEmail = user.email || localStorage.getItem('authContact');
            
            if (userEmail) {
              console.log("Setting up verification for:", userEmail);
              setEmail(userEmail);
              // Generate a new verification code
              const newCode = Math.floor(1000 + Math.random() * 9000).toString();
              setVerificationCode(newCode);
              setIsEmailSubmitted(true);
              
              // Send verification code
              await sendVerificationCode(userEmail, newCode);
            }
          }
        } else if (error) {
          console.error("Error checking verification status:", error);
          // In development mode, default to unverified for testing
          if (process.env.NODE_ENV === 'development' && loadingTimeout) {
            setIsVerified(false);
            setIsEmailSubmitted(true);
            const userEmail = localStorage.getItem('authContact') || 'test@example.com';
            setEmail(userEmail);
            const newCode = Math.floor(1000 + Math.random() * 9000).toString();
            setVerificationCode(newCode);
            console.log("Development verification code:", newCode);
          }
        }
      } catch (err) {
        console.error("Error checking email verification:", err);
      } finally {
        setIsVerifying(false);
      }
    };
    
    checkEmailVerification();
  }, [isAuthenticated, user?.id, loadingTimeout]);
  
  const handleEmailSubmit = (email: string, code: string) => {
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
    setIsVerified(true);
    localStorage.setItem('emailVerificationCompleted', 'true');
    
    // Force reload to ensure auth state is updated everywhere
    window.location.reload();
  };

  // If we're loading auth state, show a spinner
  if ((loading || isVerifying) && !loadingTimeout) {
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
  if (!isVerified) {
    console.log("Showing verification form because user is not verified");
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

  console.log("User is authenticated and verified, showing content");
  // User is authenticated and verified
  return <>{children}</>;
};

export default ProtectedRoute;
