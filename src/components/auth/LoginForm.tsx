import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import { Dialog } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { authSchema } from "./authSchema";
import PasswordField from "./PasswordField";
import VerificationDialog from "./VerificationDialog";
import { Spinner } from "@/components/ui/spinner";

type LoginFormProps = {
  isLoginMode: boolean;
  toggleAuthMode: () => void;
  onForgotPassword: () => void;
};

const LoginForm = ({ isLoginMode, toggleAuthMode, onForgotPassword }: LoginFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [storedEmail, setStoredEmail] = useState("");
  const [storedPassword, setStoredPassword] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [animateLogin, setAnimateLogin] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange", // Enable validation on change for immediate feedback
  });

  const sendVerificationEmail = async (email: string, code: string) => {
    setSendingEmail(true);
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
    } finally {
      setSendingEmail(false);
    }
  };

  const handleEmailAuth = async (values: any) => {
    setIsLoading(true);
    setAnimateLogin(true);
    
    try {
      if (isLoginMode) {
        console.log("Attempting login with:", values.email);
        await signIn(values.email, values.password);
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
      } else {
        // For signup, store credentials and show verification dialog
        setStoredEmail(values.email);
        setStoredPassword(values.password);
        
        // Generate a random 4-digit code
        const code = Math.floor(1000 + Math.random() * 9000).toString();
        setGeneratedCode(code);
        
        // Send the verification code email
        await sendVerificationEmail(values.email, code);
        
        // Show verification dialog
        setShowVerification(true);
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      toast({
        title: isLoginMode ? "Login failed" : "Sign up failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      // Keep animation for a short time even after loading finishes
      setTimeout(() => setAnimateLogin(false), 600);
    }
  };

  const completeSignUp = async () => {
    try {
      await signUp(storedEmail, storedPassword);
      setShowVerification(false);
      form.reset();
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
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleEmailAuth)} className="space-y-4">
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="your@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <PasswordField 
              form={form} 
              name="password" 
              label="Password" 
            />

            {!isLoginMode && (
              <PasswordField 
                form={form} 
                name="confirmPassword" 
                label="Confirm Password" 
              />
            )}
            
            {isLoginMode && (
              <div className="text-right">
                <Button 
                  variant="link" 
                  className="text-love hover:text-love-dark p-0 h-auto"
                  onClick={onForgotPassword}
                  type="button"
                >
                  Forgot password?
                </Button>
              </div>
            )}
            
            <Button 
              type="submit" 
              className={`w-full transition-all duration-300 ${animateLogin ? 'animate-login bg-love-light scale-105 shadow-lg' : 'bg-love hover:bg-love-dark'}`}
              disabled={isLoading || sendingEmail}
            >
              {isLoading || sendingEmail ? (
                <span className="flex items-center justify-center">
                  <Spinner className="mr-2 h-4 w-4" />
                  {isLoginMode ? "Logging in..." : "Preparing verification..."}
                </span>
              ) : (
                isLoginMode ? "Log In with Email" : "Sign Up with Email"
              )}
            </Button>
          </form>
        </Form>
        
        <div className="mt-6 text-center text-sm">
          <button 
            type="button"
            className="text-love hover:underline"
            onClick={toggleAuthMode}
          >
            {isLoginMode 
              ? "Don't have an account? Sign up instead" 
              : "Already have an account? Log in instead"}
          </button>
        </div>
      </div>

      {/* Verification Code Dialog */}
      <Dialog open={showVerification} onOpenChange={setShowVerification}>
        <VerificationDialog 
          email={storedEmail}
          generatedCode={generatedCode}
          setGeneratedCode={setGeneratedCode}
          onVerifySuccess={completeSignUp}
          password={storedPassword}
          sendingEmail={sendingEmail}
          setSendingEmail={setSendingEmail}
        />
      </Dialog>
    </>
  );
};

export default LoginForm;
