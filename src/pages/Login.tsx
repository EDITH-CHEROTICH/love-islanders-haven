
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import AlreadyLoggedIn from '@/components/auth/AlreadyLoggedIn';
import { Spinner } from '@/components/ui/spinner';
import EmailAuthForm from '@/components/auth/EmailAuthForm';
import VerificationForm from '@/components/auth/VerificationForm';
import { supabase } from '@/integrations/supabase/client';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  
  // Check if user wants to explicitly access the login page
  const isDirectLoginAccess = location.pathname === '/login' && !location.state?.from;
  
  useEffect(() => {
    console.log("Login page - isAuthenticated:", isAuthenticated);
    
    // Wait until authentication state is determined
    if (loading) return;
    
    // If user is authenticated
    if (isAuthenticated) {
      // If redirected from a protected route, go back to that route
      if (location.state?.from) {
        const from = location.state.from.pathname || '/discover';
        console.log("Redirecting to:", from);
        navigate(from, { replace: true });
      } 
      // Otherwise redirect to discover page
      else if (!isDirectLoginAccess) {
        console.log("Redirecting to discover");
        navigate('/discover', { replace: true });
      }
    }
  }, [isAuthenticated, navigate, location, isDirectLoginAccess, loading]);

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
      
      // Send verification code via email
      const { error } = await supabase.functions.invoke('send-verification-email', {
        body: { 
          email, 
          code: newCode 
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      console.log("Resent verification code:", newCode);
    } catch (error: any) {
      console.error("Error resending verification code:", error);
    } finally {
      setIsSendingCode(false);
    }
  };

  // Show a loading indicator while authentication state is being determined
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-island-dark via-island to-island-dark flex items-center justify-center">
        <Spinner className="h-12 w-12 text-love" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-island-dark via-island to-island-dark pt-4 pb-20 flex flex-col items-center justify-center px-4">
      {isAuthenticated && isDirectLoginAccess ? (
        <AlreadyLoggedIn />
      ) : (
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
            />
          ) : (
            <EmailAuthForm onEmailSubmit={handleEmailSubmit} />
          )}
        </div>
      )}
    </div>
  );
};

export default Login;
