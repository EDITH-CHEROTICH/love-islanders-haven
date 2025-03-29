
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/auth";
import { authSchema } from "./authSchema";
import PasswordField from "./PasswordField";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

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
  const { signIn } = useAuth();

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
    
    try {
      if (isLoginMode) {
        console.log("Attempting login with:", values.email);
        
        const result = await signIn(values.email, values.password);
        console.log("Login result:", result);
        
        if (result) {
          toast("Login successful", {
            description: "Welcome back!",
          });
        } else {
          throw new Error("Invalid credentials");
        }
      } else {
        console.log("Starting signup process for:", values.email);
        // For signup, we're using the verification process
        // Generate a random 6-digit code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Store credentials for later
        onStoreCredentials(values.email, values.password, verificationCode);
        
        toast("Verification required", {
          description: "Please check your email for a verification code.",
        });
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      toast("Authentication failed", {
        description: error.message || "Something went wrong",
        style: { backgroundColor: "#f44336", color: "white" }
      });
    } finally {
      setIsLoading(false);
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
          className="w-full bg-love hover:bg-love-dark transition-all duration-300"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <Spinner className="mr-2 h-4 w-4 text-white" />
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
