
import { useState } from "react";
import { useAuth } from "@/context/auth";
import { toast } from "sonner";
import EmailAuthForm from "./EmailAuthForm";
import AuthToggle from "./AuthToggle";
import EmailVerificationHandler from "./EmailVerificationHandler";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

type LoginFormProps = {
  isLoginMode: boolean;
  toggleAuthMode: () => void;
  onForgotPassword: () => void;
};

const LoginForm = ({ isLoginMode, toggleAuthMode, onForgotPassword }: LoginFormProps) => {
  const [storedEmail, setStoredEmail] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleEmailSubmit = async (email: string, code: string) => {
    console.log("LoginForm: Storing email for verification, code:", code);
    setStoredEmail(email);
    setGeneratedCode(code);
  };

  const completeSignUp = async () => {
    try {
      console.log("LoginForm: Completing signup");
      // Fix: store the result of signUp and check for success
      const signupResult = await signUp(storedEmail, "");
      if (!signupResult) {
        throw new Error("Signup failed");
      }
      
      // Set localStorage auth
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('authMethod', 'email');
      localStorage.setItem('authContact', storedEmail);
      
      console.log("LoginForm: Signup successful, navigating to discover");
      // Explicitly navigate after successful signup
      navigate('/discover', { replace: true });
      return true;
    } catch (error: any) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  return (
    <>
      <div className="glass-card w-full max-w-md p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-gradient text-center mb-6">
          {isLoginMode ? "Log In" : "Sign Up"}
        </h1>
        
        <EmailAuthForm 
          onEmailSubmit={handleEmailSubmit}
        />
        
        <AuthToggle 
          isLoginMode={isLoginMode}
          toggleAuthMode={toggleAuthMode}
        />
      </div>

      {/* Verification Dialog - only shown after signup */}
      {generatedCode && (
        <EmailVerificationHandler
          email={storedEmail}
          generatedCode={generatedCode}
          onCompleteSignUp={completeSignUp}
        />
      )}
    </>
  );
};

export default LoginForm;
