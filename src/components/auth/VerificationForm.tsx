
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
        
        // Sign up the user with Supabase
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password: crypto.randomUUID(), // Generate a random password
          options: {
            emailRedirectTo: window.location.origin + '/discover',
            data: {
              email_verified: true
            }
          }
        });

        if (authError) {
          console.error("Error during signup:", authError);
          
          // If the error is because the user already exists, try to sign in
          if (authError.message.includes("User already registered")) {
            const { data: signInData, error: signInError } = await supabase.auth.signInWithOtp({
              email,
              options: {
                emailRedirectTo: window.location.origin + '/discover'
              }
            });
            
            if (signInError) {
              throw new Error(signInError.message);
            }
          } else {
            throw authError;
          }
        }
        
        // Get user ID (either from signup or from existing session)
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          try {
            // Use RLS bypass with service role to insert/update profile
            const serviceClient = supabase.auth.admin;
            
            // Check if profile already exists
            const { data: existingProfile } = await supabase
              .from('profiles')
              .select('id')
              .eq('id', user.id)
              .single();

            if (!existingProfile) {
              // Create profile using an admin function (bypassing RLS)
              await supabase.functions.invoke('create-user-profile', {
                body: { 
                  userId: user.id,
                  name: email.split('@')[0], 
                  emailVerified: true
                }
              });
              console.log("Profile created for user");
            } else {
              console.log("Profile already exists for user");
            }
          } catch (profileError) {
            console.error("Error handling profile:", profileError);
            // Continue even if profile creation fails - we can try again later
          }
        }
        
        // Set authentication in localStorage
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('authMethod', 'email');
        localStorage.setItem('authContact', email);
        
        // Set verification status in localStorage
        localStorage.setItem('emailVerificationCompleted', 'true');
        
        toast.success("Verification successful!");
        
        // First call onClose to close the popup
        if (onClose) {
          console.log("Calling onClose callback to close the verification popup");
          onClose();
        }
        
        // Then navigate to discover page with a small delay to ensure state updates
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
