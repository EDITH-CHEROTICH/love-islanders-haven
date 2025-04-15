
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import AlreadyLoggedIn from '@/components/auth/AlreadyLoggedIn';
import SocialLoginButton from '@/components/auth/SocialLoginButton';
import { Loader2, ArrowRight, LockKeyhole } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, signUp, resetPassword, isAuthenticated, loading, signInWithGoogle } = useAuth();
  
  const from = location.state?.from?.pathname || '/discover';

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const forgotForm = useForm<{ email: string }>({
    resolver: zodResolver(z.object({
      email: z.string().email('Please enter a valid email address'),
    })),
    defaultValues: {
      email: '',
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from, loading]);

  const handleLogin = async (data: z.infer<typeof loginSchema>) => {
    setIsSubmitting(true);
    
    try {
      const result = await signIn(data.email, data.password);
      if (result.error) {
        throw result.error;
      }
      toast.success('Logged in successfully!');
      
      // Navigate based on redirectAfterAuth or default to /discover
      const redirectPath = localStorage.getItem('redirectAfterAuth') || '/discover';
      navigate(redirectPath, { replace: true });
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to log in');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (data: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true);
    
    try {
      await signUp(data.email, data.password);
      toast.success('Account created! Please check your email for verification.');
      // Switch back to login mode after successful signup
      setAuthMode('login');
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Failed to create account');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (data: { email: string }) => {
    setIsSubmitting(true);
    
    try {
      await resetPassword(data.email);
      toast.success('Password reset link sent to your email');
      // Switch back to login mode after password reset email sent
      setAuthMode('login');
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast.error(error.message || 'Failed to send reset link');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // Note: No need to navigate here as the auth state change will handle it
    } catch (error: any) {
      console.error('Google login error:', error);
      toast.error(error.message || 'Failed to sign in with Google');
    }
  };

  if (isAuthenticated) {
    return <AlreadyLoggedIn />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-island-dark via-island to-island-dark p-4">
      <div className="w-full max-w-md">
        {authMode === 'forgot' ? (
          <Card className="bg-island-dark/80 backdrop-blur-md border-island-light text-white">
            <CardHeader>
              <CardTitle className="text-gradient">Reset Password</CardTitle>
              <CardDescription className="text-gray-300">
                Enter your email to receive a password reset link
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...forgotForm}>
                <form onSubmit={forgotForm.handleSubmit(handleForgotPassword)} className="space-y-4">
                  <FormField
                    control={forgotForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="email" 
                            placeholder="your@email.com"
                            className="bg-island-light/20 border-island-light"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full bg-love hover:bg-love-dark"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Reset Link
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button 
                variant="link" 
                className="text-love hover:text-love-light"
                onClick={() => setAuthMode('login')}
              >
                Back to login
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className="bg-island-dark/80 backdrop-blur-md border-island-light text-white">
            <CardHeader>
              <CardTitle className="text-gradient">
                {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
              </CardTitle>
              <CardDescription className="text-gray-300">
                {authMode === 'login' 
                  ? 'Sign in to access your dating journey'
                  : 'Join the dating community today'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs 
                value={authMode} 
                onValueChange={(value) => setAuthMode(value as 'login' | 'signup')}
                className="w-full"
              >
                <TabsList className="grid grid-cols-2 mb-6 bg-island-light/20">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="email" 
                                placeholder="your@email.com"
                                className="bg-island-light/20 border-island-light"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="password" 
                                placeholder="••••••••"
                                className="bg-island-light/20 border-island-light"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full bg-love hover:bg-love-dark"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Logging in...
                          </>
                        ) : (
                          'Log In'
                        )}
                      </Button>
                    </form>
                  </Form>
                  <div className="mt-4 text-center">
                    <Button 
                      variant="link" 
                      className="text-love hover:text-love-light"
                      onClick={() => setAuthMode('forgot')}
                    >
                      <LockKeyhole className="mr-2 h-4 w-4" />
                      Forgot password?
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="signup">
                  <Form {...signupForm}>
                    <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                      <FormField
                        control={signupForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="email" 
                                placeholder="your@email.com"
                                className="bg-island-light/20 border-island-light"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signupForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="password" 
                                placeholder="••••••••"
                                className="bg-island-light/20 border-island-light"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signupForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="password" 
                                placeholder="••••••••"
                                className="bg-island-light/20 border-island-light"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full bg-love hover:bg-love-dark"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating account...
                          </>
                        ) : (
                          'Sign Up'
                        )}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-island-light"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-island-dark px-2 text-muted-foreground">or continue with</span>
                </div>
              </div>
              
              <SocialLoginButton 
                provider="google" 
                onLogin={handleGoogleSignIn}
                isLoginMode={authMode === 'login'} 
                className="w-full"
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Login;
