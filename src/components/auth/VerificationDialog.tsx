
import { useState } from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface VerificationDialogProps {
  email: string;
  generatedCode: string;
  setGeneratedCode: (code: string) => void;
  onVerifySuccess: () => void;
  password: string;
  sendingEmail: boolean;
  setSendingEmail: (sending: boolean) => void;
}

const VerificationDialog = ({
  email,
  generatedCode,
  setGeneratedCode,
  onVerifySuccess,
  password,
  sendingEmail,
  setSendingEmail
}: VerificationDialogProps) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendVerificationEmail = async (email: string, code: string) => {
    setSendingEmail(true);
    try {
      const { error } = await supabase.functions.invoke('send-verification-email', {
        body: { email, code }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast.success(`Verification code sent to ${email}. Please check your inbox.`);
    } catch (error: any) {
      console.error("Error sending verification email:", error);
      toast.error("We couldn't send the verification code. Please try again.");
    } finally {
      setSendingEmail(false);
    }
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 4) {
      toast.error("Please enter a valid 4-digit code");
      return;
    }

    setIsLoading(true);
    
    try {
      // Check if the entered code matches the generated code
      if (verificationCode === generatedCode) {
        // Complete the signup process
        await onVerifySuccess();
        
        toast.success("Verification successful! Your account has been created successfully!");
        
        // Reset the verification code
        setVerificationCode("");
      } else {
        toast.error("The code you entered is incorrect. Please try again.");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    // Generate a new 4-digit code
    const newCode = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedCode(newCode);
    
    // Send the new code via email
    await sendVerificationEmail(email, newCode);
  };

  return (
    <DialogContent className="bg-island-dark border-island-light text-white max-w-md">
      <DialogHeader>
        <DialogTitle className="text-white">Verify Your Email</DialogTitle>
        <DialogDescription className="text-muted-foreground">
          We've sent a 4-digit verification code to {email}.
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
  );
};

export default VerificationDialog;
