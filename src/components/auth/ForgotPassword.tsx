
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useAuth } from "@/context/auth";
import { supabase } from "@/integrations/supabase/client";
import { 
  InputOTP, 
  InputOTPGroup, 
  InputOTPSlot 
} from "@/components/ui/input-otp";
import ResetPasswordForm from "./ResetPasswordForm";

// Schema for password reset email
const resetEmailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

// Schema for verification code
const verificationCodeSchema = z.object({
  code: z.string().length(6, { message: "Verification code must be 6 digits" }),
});

type ForgotPasswordProps = {
  onBackToLogin: () => void;
};

// Steps in the password reset flow
type ResetStep = 'email' | 'verification' | 'newPassword';

const ForgotPassword = ({ onBackToLogin }: ForgotPasswordProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [resetStep, setResetStep] = useState<ResetStep>('email');
  const [userEmail, setUserEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");

  const emailForm = useForm<z.infer<typeof resetEmailSchema>>({
    resolver: zodResolver(resetEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSendVerificationCode = async (values: z.infer<typeof resetEmailSchema>) => {
    setIsLoading(true);
    try {
      // Generate a random 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(code);
      setUserEmail(values.email);
      
      // Send the verification code via Supabase edge function
      const { error } = await supabase.functions.invoke('send-verification-email', {
        body: { 
          email: values.email, 
          code,
          subject: "Password Reset Verification Code"
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast("Verification code sent", {
        description: `Please check your email for the verification code.`,
      });
      
      // Move to verification step
      setResetStep('verification');
    } catch (error: any) {
      console.error("Error sending verification code:", error);
      toast("Failed to send verification code", {
        description: error.message || "Please try again later",
        style: { backgroundColor: "#f44336", color: "white" }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = () => {
    if (verificationCode !== generatedCode) {
      toast("Invalid verification code", {
        description: "The code you entered is incorrect. Please try again.",
        style: { backgroundColor: "#f44336", color: "white" }
      });
      return;
    }
    
    // Code is valid, move to password reset step
    setResetStep('newPassword');
  };

  return (
    <div className="glass-card w-full max-w-md p-6 rounded-xl shadow-lg">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-2 p-0" 
          onClick={onBackToLogin}
        >
          <ArrowLeft size={18} />
        </Button>
        <h1 className="text-2xl font-bold text-gradient">Reset Password</h1>
      </div>
      
      {resetStep === 'email' && (
        <>
          <p className="mb-4">Enter your email and we'll send you a verification code.</p>
          
          <Form {...emailForm}>
            <form onSubmit={emailForm.handleSubmit(handleSendVerificationCode)} className="space-y-4">
              <FormField
                control={emailForm.control}
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
                {isLoading ? "Sending..." : "Send Verification Code"}
              </Button>
            </form>
          </Form>
        </>
      )}

      {resetStep === 'verification' && (
        <div className="space-y-4">
          <p className="text-center">
            Please enter the 6-digit verification code sent to {userEmail}
          </p>
          
          <div className="flex justify-center py-4">
            <InputOTP 
              maxLength={6} 
              value={verificationCode} 
              onChange={setVerificationCode}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          
          <Button 
            onClick={handleVerifyCode}
            className="w-full bg-love hover:bg-love-dark"
            disabled={verificationCode.length !== 6 || isLoading}
          >
            Verify Code
          </Button>
          
          <div className="text-center text-sm text-muted-foreground mt-2">
            <button 
              type="button"
              className="text-love hover:underline"
              onClick={() => handleSendVerificationCode({ email: userEmail })}
              disabled={isLoading}
            >
              Didn't receive a code? Send again
            </button>
          </div>
        </div>
      )}

      {resetStep === 'newPassword' && (
        <ResetPasswordForm 
          email={userEmail} 
          onSuccess={onBackToLogin}
        />
      )}
    </div>
  );
};

export default ForgotPassword;
