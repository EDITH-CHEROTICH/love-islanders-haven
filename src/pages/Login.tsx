
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AlreadyLoggedIn from '@/components/auth/AlreadyLoggedIn';
import LoginForm from '@/components/auth/LoginForm';
import ForgotPassword from '@/components/auth/ForgotPassword';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  
  // Check if user wants to explicitly access the login page
  const isDirectLoginAccess = location.pathname === '/login' && !location.state?.from;
  
  // Only redirect if authenticated and not directly accessing login page
  useEffect(() => {
    console.log("Login page - isAuthenticated:", isAuthenticated);
    console.log("Login page - isDirectLoginAccess:", isDirectLoginAccess);
    console.log("Login page - location state:", location.state);
    
    // If user is authenticated AND was redirected here from a protected route
    if (isAuthenticated && location.state?.from) {
      const from = location.state.from.pathname || '/ai-companion';
      console.log("Redirecting to:", from);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location, isDirectLoginAccess]);

  const toggleAuthMode = () => {
    setIsLoginMode(!isLoginMode);
  };

  const handleForgotPassword = () => {
    setIsForgotPassword(true);
  };

  const handleBackToLogin = () => {
    setIsForgotPassword(false);
  };

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
