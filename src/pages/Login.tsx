
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/context/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import * as z from "zod";

// Auth schema for login/signup validation
const authSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

// Schema for password reset (email only)
const resetPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, signInWithGoogle, isAuthenticated, signOut, resetPassword } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

  const form = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const resetForm = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  // Allow already logged in users to log out from the login page
  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
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
        await signUp(values.email, values.password);
        toast({
          title: "Sign up successful",
          description: "Please check your email to verify your account.",
        });
        // We don't navigate here as the useEffect will handle it once isAuthenticated changes
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

  const handlePasswordReset = async (values: z.infer<typeof resetPasswordSchema>) => {
    setIsLoading(true);
    try {
      await resetPassword(values.email);
      toast({
        title: "Password reset email sent",
        description: "Please check your email for the password reset link.",
      });
      // Return to login form after successful request
      setIsForgotPassword(false);
    } catch (error: any) {
      toast({
        title: "Password reset failed",
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
      // Let the user know we're initiating Google auth
      toast({
        title: "Google authentication initiated",
        description: "You'll be redirected to Google for authentication...",
      });
      
      // Call the Google sign-in function
      await signInWithGoogle();
      
      // Note: This code below will generally not run since the page will be redirected by Supabase
      // But we'll keep it for cases where the redirect might not happen immediately
    } catch (error: any) {
      // This will catch any error that happens before the redirect
      setGoogleLoading(false);
      toast({
        title: "Google authentication failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleAuthMode = () => {
    setIsLoginMode(!isLoginMode);
    form.reset();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-island-dark via-island to-island-dark pt-4 pb-20 flex flex-col items-center justify-center px-4">
        <div className="glass-card w-full max-w-md p-6 rounded-xl shadow-lg">
          <div className="space-y-4 text-center">
            <h1 className="text-2xl font-bold text-gradient text-center mb-6">
              Already Logged In
            </h1>
            <p className="mb-4">You are already logged in to your account.</p>
            <Button 
              variant="outline"
              className="w-full" 
              onClick={handleLogout}
            >
              Log Out
            </Button>
            <Button 
              className="w-full bg-love hover:bg-love-dark" 
              onClick={() => navigate('/ai-companion')}
            >
              Return to App
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-island-dark via-island to-island-dark pt-4 pb-20 flex flex-col items-center justify-center px-4">
        <div className="glass-card w-full max-w-md p-6 rounded-xl shadow-lg">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mr-2 p-0" 
              onClick={() => setIsForgotPassword(false)}
            >
              <ArrowLeft size={18} />
            </Button>
            <h1 className="text-2xl font-bold text-gradient">Reset Password</h1>
          </div>
          
          <p className="mb-4">Enter your email and we'll send you a link to reset your password.</p>
          
          <Form {...resetForm}>
            <form onSubmit={resetForm.handleSubmit(handlePasswordReset)} className="space-y-4">
              <FormField
                control={resetForm.control}
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
              
              <Button 
                type="submit" 
                className="w-full bg-love hover:bg-love-dark"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-island-dark via-island to-island-dark pt-4 pb-20 flex flex-col items-center justify-center px-4">
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
                        placeholder="••••••••" 
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
            
            {isLoginMode && (
              <div className="text-right">
                <Button 
                  variant="link" 
                  className="text-love hover:text-love-dark p-0 h-auto"
                  onClick={() => setIsForgotPassword(true)}
                  type="button"
                >
                  Forgot password?
                </Button>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-love hover:bg-love-dark"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : isLoginMode ? "Log In with Email" : "Sign Up with Email"}
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
    </div>
  );
};

export default Login;
