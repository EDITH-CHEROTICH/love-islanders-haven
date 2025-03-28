
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import AlreadyLoggedIn from '@/components/auth/AlreadyLoggedIn';
import LoginForm from '@/components/auth/LoginForm';
import ForgotPassword from '@/components/auth/ForgotPassword';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  
  // Check if user wants to explicitly access the login page
  const isDirectLoginAccess = location.pathname === '/login' && !location.state?.from;
  
  useEffect(() => {
    console.log("Login page - isAuthenticated:", isAuthenticated);
    console.log("Login page - isDirectLoginAccess:", isDirectLoginAccess);
    console.log("Login page - location state:", location.state);
    
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
      // Otherwise redirect to discover
      else {
        console.log("Redirecting to discover");
        navigate('/discover', { replace: true });
      }
    }
  }, [isAuthenticated, navigate, location, isDirectLoginAccess, loading]);

  const toggleAuthMode = () => {
    setIsLoginMode(!isLoginMode);
  };

  const handleForgotPassword = () => {
    setIsForgotPassword(true);
  };

  const handleBackToLogin = () => {
    setIsForgotPassword(false);
  };

  // Show a loading indicator while authentication state is being determined
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-island-dark via-island to-island-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-love"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-island-dark via-island to-island-dark pt-4 pb-20 flex flex-col items-center justify-center px-4">
      {isAuthenticated ? (
        <AlreadyLoggedIn />
      ) : isForgotPassword ? (
        <ForgotPassword onBackToLogin={handleBackToLogin} />
      ) : (
        <LoginForm 
          isLoginMode={isLoginMode} 
          toggleAuthMode={toggleAuthMode} 
          onForgotPassword={handleForgotPassword} 
        />
      )}
    </div>
  );
};

export default Login;
