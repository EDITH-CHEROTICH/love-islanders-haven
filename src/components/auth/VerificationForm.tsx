
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
  onClose?: () => void; // Make onClose optional
}

const VerificationForm = ({ 
  email, 
  generatedCode, 
  onResendCode,
  isSendingCode,
  onClose
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
        console.log("Code verified successfully");
        
        // Get user ID (either from signup or from existing session)
        const { data: { user } } = await supabase.auth.getUser();
        
        // Update email verification status
        if (user) {
          try {
            console.log("Updating profile with verified status for user:", user.id);
            // Create/update profile with email verification status
            const { error } = await supabase
              .from('profiles')
              .upsert({
                id: user.id,
                name: email.split('@')[0], // Default name from email
                email_verified: true,
                gender_preference: 'both',
                relationship_goal: 'both'
              }, {
                onConflict: 'id'
              });

            if (error) {
              console.error("Error updating profile:", error);
              // Try admin function approach if direct update fails
              await supabase.functions.invoke('create-user-profile', {
                body: { 
                  userId: user.id,
                  name: email.split('@')[0], 
                  emailVerified: true
                }
              });
            }
            
            console.log("Profile created/updated with verified status");
          } catch (profileError) {
            console.error("Error handling profile:", profileError);
          }
        }
        
        // Set verification status in localStorage
        localStorage.setItem('emailVerificationCompleted', 'true');
        localStorage.setItem('authContact', email);
        
        toast.success("Verification successful!");
        
        // First call onClose to close the popup if provided
        if (onClose) {
          console.log("Calling onClose callback");
          onClose();
          
          // After a short delay, navigate to discover page
          setTimeout(() => {
            navigate('/discover', { replace: true });
          }, 500);
        } else {
          // If no onClose callback, navigate to discover page
          console.log("No onClose callback, navigating to discover");
          navigate('/discover', { replace: true });
        }
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
