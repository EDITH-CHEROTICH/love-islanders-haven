
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/auth";
import { authSchema } from "./authSchema";
import PasswordField from "./PasswordField";
import { Spinner } from "@/components/ui/spinner";
import { Loader } from "lucide-react";

interface EmailAuthFormProps {
  isLoginMode: boolean;
  onForgotPassword: () => void;
  onStoreCredentials: (email: string, password: string, code: string) => void;
}

const EmailAuthForm = ({ 
  isLoginMode, 
  onForgotPassword,
  onStoreCredentials 
}: EmailAuthFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
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

  const handleEmailAuth = async (values: any) => {
    setIsLoading(true);
    setAnimateLogin(true);
    
    try {
      if (isLoginMode) {
        console.log("Attempting login with:", values.email);
        const result = await signIn(values.email, values.password);
        console.log("Login result:", result);
        
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        // No need to manually redirect - the auth context will handle this
      } else {
        console.log("Starting signup process for:", values.email);
        if (process.env.NODE_ENV === 'development') {
          // For signup, directly complete the process in development mode
          await signUp(values.email, values.password);
          console.log("Signup completed successfully");
          
          toast({
            title: "Account created successfully",
            description: "You are now logged in!",
          });
        } else {
          // In production, generate a verification code and store credentials
          const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
          onStoreCredentials(values.email, values.password, verificationCode);
        }
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

  return (
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
          className={`w-full transition-all duration-300 ${animateLogin ? 'animate-pulse bg-love-light scale-105 shadow-lg' : 'bg-love hover:bg-love-dark'}`}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              {isLoginMode ? "Logging in..." : "Signing up..."}
            </span>
          ) : (
            isLoginMode ? "Log In with Email" : "Sign Up with Email"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default EmailAuthForm;
