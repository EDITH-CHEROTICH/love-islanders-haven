import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useAuth } from "@/context/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { supabase } from "@/integrations/supabase/client";

// Auth schema for login/signup validation
const authSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  // Only validate confirmPassword when in signup mode
  if (data.confirmPassword !== undefined) {
    return data.password === data.confirmPassword;
  }
  return true;
}, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Verification schema
const verificationSchema = z.object({
  code: z.string().length(4, { message: "Verification code must be 4 digits" })
});

type LoginFormProps = {
  isLoginMode: boolean;
  toggleAuthMode: () => void;
  onForgotPassword: () => void;
};

const LoginForm = ({ isLoginMode, toggleAuthMode, onForgotPassword }: LoginFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [storedEmail, setStoredEmail] = useState("");
  const [storedPassword, setStoredPassword] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof authSchema>>({
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

  const handleEmailAuth = async (values: z.infer<typeof authSchema>) => {
    setIsLoading(true);
    try {
      if (isLoginMode) {
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
      toast({
        title: isLoginMode ? "Login failed" : "Sign up failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 4) {
      toast({
        title: "Invalid code",
        description: "Please enter a valid 4-digit code",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Check if the entered code matches the generated code
      if (verificationCode === generatedCode) {
        // Complete the signup process
        await signUp(storedEmail, storedPassword);
        
        toast({
          title: "Verification successful",
          description: "Your account has been created successfully!",
        });
        
        // Close the verification dialog
        setShowVerification(false);
        
        // Reset the form
        form.reset();
      } else {
        toast({
          title: "Verification failed",
          description: "The code you entered is incorrect. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      toast({
        title: "Google authentication initiated",
        description: "You'll be redirected to Google for authentication...",
      });
      
      await signInWithGoogle();
    } catch (error: any) {
      setGoogleLoading(false);
      toast({
        title: "Google authentication failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleResendCode = async () => {
    // Generate a new 4-digit code
    const newCode = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedCode(newCode);
    
    // Send the new code via email
    await sendVerificationEmail(storedEmail, newCode);
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
            
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="" 
                        {...field} 
                      />
                      <button 
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={togglePasswordVisibility}
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            
            {!isLoginMode && (
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showConfirmPassword ? "text" : "password"} 
                          placeholder="" 
                          {...field} 
                        />
                        <button 
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={toggleConfirmPasswordVisibility}
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="animate-shake" />
                  </FormItem>
                )}
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
              className="w-full bg-love hover:bg-love-dark"
              disabled={isLoading || sendingEmail}
            >
              {isLoading || sendingEmail ? 
                (isLoginMode ? "Logging in..." : "Preparing verification...") : 
                (isLoginMode ? "Log In with Email" : "Sign Up with Email")}
            </Button>
          </form>
        </Form>
        
        
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
          </div>
        </div>
        
        
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGoogleLogin}
          disabled={googleLoading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" className="mr-2">
            <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"/>
          </svg>
          {googleLoading ? "Connecting..." : isLoginMode ? "Sign in with Google" : "Sign up with Google"}
        </Button>
        
        
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
        <DialogContent className="bg-island-dark border-island-light text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Verify Your Email</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              We've sent a 4-digit verification code to {storedEmail}.
              Please check your inbox and enter the code below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="flex justify-center py-2">
              <InputOTP maxLength={4} value={verificationCode} onChange={setVerificationCode}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            
            <Button 
              onClick={handleVerifyCode}
              disabled={verificationCode.length !== 4 || isLoading}
              className="w-full bg-love hover:bg-love-dark"
            >
              {isLoading ? "Verifying..." : "Verify Code"}
            </Button>
            
            <div className="text-center text-sm text-muted-foreground">
              <button 
                onClick={handleResendCode}
                className="text-love hover:underline"
                type="button"
                disabled={sendingEmail}
              >
                {sendingEmail ? "Sending..." : "Didn't receive a code? Send again"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LoginForm;
