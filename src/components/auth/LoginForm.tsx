
import { useState } from "react";
import { useAuth } from "@/context/auth";
import { toast } from "sonner";
import EmailAuthForm from "./EmailAuthForm";
import AuthToggle from "./AuthToggle";
import EmailVerificationHandler from "./EmailVerificationHandler";
import { supabase } from "@/integrations/supabase/client";

type LoginFormProps = {
  isLoginMode: boolean;
  toggleAuthMode: () => void;
  onForgotPassword: () => void;
};

const LoginForm = ({ isLoginMode, toggleAuthMode, onForgotPassword }: LoginFormProps) => {
  const [storedEmail, setStoredEmail] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const { signUp } = useAuth();

  const handleEmailSubmit = async (email: string, code: string) => {
    console.log("LoginForm: Storing email for verification, code:", code);
    setStoredEmail(email);
    setGeneratedCode(code);
  };

  const completeSignUp = async () => {
    try {
      console.log("LoginForm: Completing signup");
      // Fix: pass an empty string as the second argument (password) since signUp expects 2 arguments
      const success = await signUp(storedEmail, "");
      
      if (success) {
        // Set localStorage auth
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('authMethod', 'email');
        localStorage.setItem('authContact', storedEmail);
        localStorage.setItem('emailVerificationCompleted', 'true');
        
        console.log("LoginForm: Signup successful");
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "Error completing signup");
      return false;
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

      {/* Verification Dialog - only shown after email submission */}
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
