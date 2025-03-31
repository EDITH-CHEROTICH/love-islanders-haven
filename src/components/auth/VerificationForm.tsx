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

interface ProfileQueryResult {
  data: { id: string } | null;
  error: any;
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
        console.log("Code verified successfully");
        
        // Get or create user
        let userId: string | undefined;
        
        // Check if user already exists
        const { data, error } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', email)
          .maybeSingle() as unknown as ProfileQueryResult;
        
        if (error) {
          console.error("Error checking user:", error);
          throw error;
        }
        
        if (data) {
          userId = data.id;
        } else {
          // Create user
          const { data: signupData, error: signupError } = await supabase.auth.signUp({
            email,
            password: crypto.randomUUID(), // Generate a random password
            options: {
              emailRedirectTo: window.location.origin + '/discover',
              data: {
                email_verified: true
              }
            }
          });
          
          if (signupError) {
            throw signupError;
          }
          
          userId = signupData.user?.id;
        }
        
        // Create/update user profile
        if (userId) {
          try {
            const { error: profileError } = await supabase
              .from('profiles')
              .upsert({
                id: userId,
                name: email.split('@')[0], // Default name from email
                email: email,
                email_verified: true // Set email as verified
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
        
        // Set authentication in localStorage
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('authMethod', 'email');
        localStorage.setItem('authContact', email);
        
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
