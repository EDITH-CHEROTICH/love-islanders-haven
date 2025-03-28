
import { useState } from "react";
import { useAuth } from "@/context/auth";
import { useToast } from "@/hooks/use-toast";
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
  const [storedPassword, setStoredPassword] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const { signUp } = useAuth();
  const { toast } = useToast();

  const handleStoreCredentials = async (email: string, password: string, code: string) => {
    setStoredEmail(email);
    setStoredPassword(password);
    setGeneratedCode(code);
    
    // Send the verification code email
    await sendVerificationEmail(email, code);
  };

  const sendVerificationEmail = async (email: string, code: string) => {
    try {
      const { error } = await supabase.functions.invoke('send-verification-email', {
        body: { email, code }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast({
        title: "Verification code sent",
        description: `We've sent a verification code to ${email}. Please check your inbox.`,
      });
    } catch (error: any) {
      console.error("Error sending verification email:", error);
      toast({
        title: "Error sending email",
        description: "We couldn't send the verification code. Please try again.",
        variant: "destructive",
      });
    }
  };

  const completeSignUp = async () => {
    try {
      const result = await signUp(storedEmail, storedPassword);
      if (!result) {
        throw new Error("Signup failed");
      }
      return true;
    } catch (error: any) {
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
          isLoginMode={isLoginMode}
          onForgotPassword={onForgotPassword}
          onStoreCredentials={handleStoreCredentials}
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
          password={storedPassword}
          generatedCode={generatedCode}
          onCompleteSignUp={completeSignUp}
        />
      )}
    </>
  );
};

export default LoginForm;
