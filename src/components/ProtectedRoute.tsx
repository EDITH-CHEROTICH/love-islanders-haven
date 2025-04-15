
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useProtectedRoute } from '@/hooks/use-protected-route';
import AuthenticationForm from './auth/AuthenticationForm';
import AuthLoadingState from './auth/AuthLoadingState';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const {
    loading,
    loadingTimeout,
    effectivelyAuthenticated,
    isEmailVerified,
    verificationCompleted,
    email,
    verificationCode,
    isEmailSubmitted,
    isSendingCode,
    handleEmailSubmit,
    handleResendCode,
    handleVerifySuccess,
    sendVerificationCode
  } = useProtectedRoute();

  console.log("ProtectedRoute - Path:", location.pathname);
  console.log("ProtectedRoute - Auth state:", { 
    effectivelyAuthenticated, 
    loading, 
    isEmailVerified, 
    verificationCompleted 
  });
  
  // If we're loading auth state, show a spinner
  if (loading && !loadingTimeout) {
    return <AuthLoadingState />;
  }

  // If not authenticated, show in-line auth form
  if (!effectivelyAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-island-dark via-island to-island-dark pt-4 pb-20 flex flex-col items-center justify-center px-4">
        <AuthenticationForm
          isEmailSubmitted={isEmailSubmitted}
          email={email}
          verificationCode={verificationCode}
          isSendingCode={isSendingCode}
          onEmailSubmit={handleEmailSubmit}
          onResendCode={handleResendCode}
          onVerifySuccess={handleVerifySuccess}
        />
      </div>
    );
  }

  // If verification completed, show content
  if (verificationCompleted) {
    return <>{children}</>;
  }
  
  // Authentication is confirmed, but check for email verification
  if (isEmailVerified === false) {
    console.log("Showing verification form because user is not verified");
    
    // If we have an email in localStorage or user object, use it
    const userEmail = localStorage.getItem('authContact') || '';
    
    // If we don't have an email yet, we need to show the email form
    if (!isEmailSubmitted && !email && userEmail) {
      // If we have an email but haven't sent a code yet, send one
      sendVerificationCode(userEmail);
    }
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-island-dark via-island to-island-dark pt-4 pb-20 flex flex-col items-center justify-center px-4">
        <AuthenticationForm
          isEmailSubmitted={isEmailSubmitted || !!userEmail}
          email={email || userEmail}
          verificationCode={verificationCode}
          isSendingCode={isSendingCode}
          onEmailSubmit={handleEmailSubmit}
          onResendCode={handleResendCode}
          onVerifySuccess={handleVerifySuccess}
        />
      </div>
    );
  }

  console.log("User is authenticated and verified, showing content");
  // User is authenticated and verified
  return <>{children}</>;
};

export default ProtectedRoute;
