
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/context/auth";
import { authSchema } from "./authSchema";
import PasswordField from "./PasswordField";
import { toast } from "sonner";
import { Loader2 } from 'lucide-react';
import { useNavigate } from "react-router-dom";

type EmailAuthFormProps = {
  isLoginMode: boolean;
  onForgotPassword: () => void;
  onStoreCredentials?: (email: string, password: string, code: string) => void;
};

const EmailAuthForm = ({ isLoginMode, onForgotPassword, onStoreCredentials }: EmailAuthFormProps) => {
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof authSchema>) => {
    setIsLoading(true);
    
    try {
      if (isLoginMode) {
        // Login mode
        const result = await signIn(data.email, data.password);
        
        if (!result) {
          throw new Error("Invalid credentials or user doesn't exist");
        }

        toast("Logged in successfully", {
          description: "Welcome back!",
        });
        
        // Redirect to discover after successful login
        navigate('/discover');
      } else {
        // Signup mode - We'll first verify email before actually signing up
        if (onStoreCredentials) {
          // Generate a 4-digit code
          const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
          
          // Store credentials and verification code for the next step
          onStoreCredentials(data.email, data.password, verificationCode);
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      
      let description = 
        error.message === "Email not confirmed" 
          ? "Please check your email for a confirmation link" 
          : error.message || "There was a problem with authentication";
          
      toast(isLoginMode ? "Login failed" : "Signup failed", {
        description,
        style: { backgroundColor: "#f44336", color: "white" }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="email@example.com"
                  {...field}
                  type="email"
                  autoComplete={isLoginMode ? "email" : "new-email"}
                  className="bg-island-light/20 border-island-light"
                />
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
              <div className="flex items-center justify-between">
                <FormLabel>Password</FormLabel>
                {isLoginMode && (
                  <Button
                    type="button"
                    variant="link"
                    className="px-0 text-xs text-love"
                    onClick={onForgotPassword}
                  >
                    Forgot password?
                  </Button>
                )}
              </div>
              <FormControl>
                <PasswordField
                  {...field}
                  autoCompleteType={isLoginMode ? "current-password" : "new-password"}
                />
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
          {isLoading ? (
            <span className="flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isLoginMode ? 'Logging in...' : 'Signing up...'}
            </span>
          ) : (
            isLoginMode ? 'Log In' : 'Sign Up'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default EmailAuthForm;
