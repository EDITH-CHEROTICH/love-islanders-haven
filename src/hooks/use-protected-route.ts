
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useProtectedRoute = () => {
  const { isAuthenticated, loading, user, emailVerified, verifyEmailWithCode } = useAuth();
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [verificationCompleted, setVerificationCompleted] = useState(false);
  
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

  // Check if email verification is completed
  useEffect(() => {
    const emailVerificationCompleted = localStorage.getItem('emailVerificationCompleted') === 'true';
    if (emailVerificationCompleted) {
      setVerificationCompleted(true);
    }
  }, []);

  const handleEmailSubmit = async (email: string, code: string) => {
    console.log("Email submitted:", email, "Code:", code);
    setEmail(email);
    setVerificationCode(code);
    setIsEmailSubmitted(true);
  };

  const sendVerificationCode = async (email: string) => {
    setIsSendingCode(true);
    
    try {
      console.log("Sending verification code to:", email);
      // Generate a new 4-digit code
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setVerificationCode(code);
      
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
    await sendVerificationCode(email);
  };

  const handleVerifySuccess = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Update profile with email verified status
        const { error } = await supabase
          .from('profiles')
          .update({
            email: email,
            email_verified: true
          })
          .eq('id', user.id);
          
        if (error) {
          console.error("Error updating email verification status:", error);
        }
      } else {
        // Handle case where no user is found
        localStorage.setItem('emailVerificationCompleted', 'true');
        localStorage.setItem('authContact', email);
      }
      
      // Mark verification as completed
      setVerificationCompleted(true);
      
      window.location.href = '/discover';
    } catch (error) {
      console.error("Error handling verification success:", error);
    }
  };
  
  // Consider both auth methods: context state and localStorage
  const effectivelyAuthenticated = isAuthenticated || localStorage.getItem('isAuthenticated') === 'true';
  
  // Check if verification completed from context or localStorage
  const isEmailVerified = emailVerified || verificationCompleted || localStorage.getItem('emailVerificationCompleted') === 'true';

  return {
    loading,
    loadingTimeout,
    effectivelyAuthenticated,
    isEmailVerified,
    verificationCompleted,
    email,
    setEmail,
    verificationCode,
    isEmailSubmitted,
    isSendingCode,
    handleEmailSubmit,
    handleResendCode,
    handleVerifySuccess,
    sendVerificationCode
  };
};
