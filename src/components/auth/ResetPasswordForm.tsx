
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Spinner } from "@/components/ui/spinner";
import PasswordField from "./PasswordField";

// Schema for password reset
const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

interface ResetPasswordFormProps {
  email: string;
  onSuccess: () => void;
}

const ResetPasswordForm = ({ email, onSuccess }: ResetPasswordFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleResetPassword = async (values: z.infer<typeof resetPasswordSchema>) => {
    if (!email) {
      toast("Error resetting password", {
        description: "Email address is missing. Please try again.",
        style: { backgroundColor: "#f44336", color: "white" }
      });
      return;
    }

    setIsLoading(true);
    try {
      // Update the user's password using admin functions
      const { error } = await supabase.functions.invoke('reset-password', {
        body: { 
          email, 
          password: values.password
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast("Password reset successful", {
        description: "Your password has been reset. You can now log in with your new password.",
      });
      
      // Go back to login
      onSuccess();
    } catch (error: any) {
      console.error("Error resetting password:", error);
      toast("Password reset failed", {
        description: error.message || "Please try again later",
        style: { backgroundColor: "#f44336", color: "white" }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="mb-4">Create a new password for your account.</p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleResetPassword)} className="space-y-4">
          <PasswordField
            form={form}
            name="password"
            label="New Password"
          />
          
          <PasswordField
            form={form}
            name="confirmPassword"
            label="Confirm New Password"
          />
          
          <Button 
            type="submit" 
            className="w-full bg-love hover:bg-love-dark"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <Spinner className="mr-2 h-4 w-4 text-white" />
                Resetting Password...
              </span>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ResetPasswordForm;
