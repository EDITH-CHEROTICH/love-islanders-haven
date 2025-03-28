
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
  const { signIn } = useAuth();
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
        await signIn(values.email, values.password);
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        // No need to return early - the auth context will handle redirect
      } else {
        // For signup, generate a random 4-digit code and store credentials
        const code = Math.floor(1000 + Math.random() * 9000).toString();
        console.log("Generated verification code for signup:", code);
        onStoreCredentials(values.email, values.password, code);
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
          className={`w-full transition-all duration-300 ${animateLogin ? 'animate-login bg-love-light scale-105 shadow-lg' : 'bg-love hover:bg-love-dark'}`}
          disabled={isLoading}
        >
          {isLoading ? (
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
  );
};

export default EmailAuthForm;
