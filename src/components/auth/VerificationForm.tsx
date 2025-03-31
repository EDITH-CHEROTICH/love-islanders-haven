
import { useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface VerificationFormProps {
  email: string;
  generatedCode: string;
  onResendCode: () => Promise<void>;
  isSendingCode: boolean;
}

const VerificationForm = ({ 
  email, 
  generatedCode, 
  onResendCode,
  isSendingCode
}: VerificationFormProps) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async () => {
    if (verificationCode.length !== 4) {
      toast.error("Please enter a valid 4-digit verification code");
      return;
    }

    setIsVerifying(true);
    
    try {
      console.log("Verifying code:", verificationCode, "Expected:", generatedCode);
      
      // Check if the verification code matches
      if (verificationCode === generatedCode) {
        console.log("Code verified successfully, signing in");
        
        // Try to retrieve existing user or create a new one
        const { data, error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            shouldCreateUser: true,
          }
        });
        
        if (error) {
          throw error;
        }
        
        // Set authentication in localStorage
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('authMethod', 'email');
        localStorage.setItem('authContact', email);
        
        // Create/update user profile
        if (data.session) {
          try {
            // Fix: Remove reference to user property that doesn't exist
            const { error: profileError } = await supabase
              .from('profiles')
              .upsert({
                id: data.session.user.id,
                name: email.split('@')[0], // Default name from email
                email: email
              }, {
                onConflict: 'id'
              });
              
            if (profileError) {
              console.error("Error creating profile:", profileError);
            } else {
              console.log("Profile created/updated for user");
            }
          } catch (err) {
            console.error("Error creating profile:", err);
          }
        }
        
        toast.success("Verification successful!");
        
        // Navigate to discover page with a small delay to ensure state updates
        setTimeout(() => {
          console.log("Navigating to discover page");
          navigate('/discover', { replace: true });
        }, 300);
      } else {
        toast.error("The code you entered is incorrect. Please try again.");
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      toast.error(error.message || "Something went wrong during verification");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-center text-muted-foreground mb-4">
          Enter the 4-digit code sent to:
          <span className="block font-medium mt-1">{email}</span>
        </p>
        
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
      </div>
      
      <Button 
        onClick={handleVerify}
        disabled={verificationCode.length !== 4 || isVerifying}
        className="w-full bg-love hover:bg-love-dark"
      >
        {isVerifying ? (
          <span className="flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verifying...
          </span>
        ) : "Verify & Continue"}
      </Button>
      
      <div className="text-center text-sm">
        <button 
          onClick={onResendCode}
          className="text-love hover:underline"
          type="button"
          disabled={isSendingCode}
        >
          {isSendingCode ? "Sending..." : "Didn't receive a code? Send again"}
        </button>
      </div>
    </div>
  );
};

export default VerificationForm;
