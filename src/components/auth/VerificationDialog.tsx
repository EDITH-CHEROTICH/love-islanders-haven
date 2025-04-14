
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface VerificationDialogProps {
  email: string;
  generatedCode: string;
  setGeneratedCode: (code: string) => void;
  onVerifySuccess: () => Promise<boolean>;
  sendingEmail: boolean;
  setSendingEmail: (sending: boolean) => void;
}

const VerificationDialog = ({
  email,
  generatedCode,
  setGeneratedCode,
  onVerifySuccess,
  sendingEmail,
  setSendingEmail
}: VerificationDialogProps) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleVerify = async () => {
    if (verificationCode.length !== 4) {
      toast.error("Please enter a valid 4-digit verification code");
      return;
    }

    setIsVerifying(true);
    
    try {
      // Check if the verification code matches
      if (verificationCode === generatedCode) {
        // Get user ID (either from signup or from existing session)
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          try {
            // Create or update user profile with verified email
            const { error } = await supabase
              .from('profiles')
              .update({
                email: email,
                email_verified: true,
              })
              .eq('id', user.id);

            if (error) {
              console.error("Error updating profile:", error);
            }
          } catch (profileError) {
            console.error("Error handling profile:", profileError);
          }
        }
        
        // Set verification status in localStorage
        localStorage.setItem('emailVerificationCompleted', 'true');
        localStorage.setItem('authContact', email);
        localStorage.setItem('isAuthenticated', 'true');
        
        toast.success("Email verification successful!");
        await onVerifySuccess();
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        if (newAttempts >= 3) {
          toast.error("Too many failed attempts. Please request a new code.");
        } else {
          toast.error(`Incorrect code. ${3 - newAttempts} attempts remaining.`);
        }
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      toast.error(error.message || "Something went wrong during verification");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    setSendingEmail(true);
    
    try {
      // Generate a new 4-digit code
      const newVerificationCode = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedCode(newVerificationCode);
      
      // Send verification email with new code
      const { error } = await supabase.functions.invoke('send-verification-email', {
        body: { 
          email, 
          code: newVerificationCode
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast.success("New verification code sent to your email");
      setAttempts(0);
    } catch (error: any) {
      console.error("Error sending verification email:", error);
      toast.error(error.message || "Failed to send verification code");
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Verify Your Email</DialogTitle>
        <DialogDescription>
          We've sent a verification code to {email}. 
          Enter the 4-digit code below to verify your email.
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col items-center space-y-4 py-2">
        <InputOTP 
          maxLength={4} 
          value={verificationCode} 
          onChange={setVerificationCode}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
        </InputOTP>
        
        <div className="flex flex-col w-full space-y-2">
          <Button 
            onClick={handleVerify}
            className="w-full bg-love hover:bg-love-dark"
            disabled={verificationCode.length !== 4 || isVerifying}
          >
            {isVerifying ? (
              <span className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </span>
            ) : "Verify Email"}
          </Button>
          
          <Button
            variant="outline"
            onClick={handleResendCode}
            className="w-full"
            disabled={sendingEmail}
          >
            {sendingEmail ? (
              <span className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </span>
            ) : "Resend Code"}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};

export default VerificationDialog;
