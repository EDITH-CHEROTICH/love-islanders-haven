
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

// Define a simple interface for the query result to avoid deep type instantiation
interface ProfileQueryResult {
  data: { id: string } | null;
  error: any;
}

// Define an interface for Supabase user
interface SupabaseUser {
  id: string;
  email?: string;
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
        
        // Get or create user
        let userId: string | undefined;
        
        // Check if user exists with this email in auth system, not profiles
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
          console.error("Error signing up user:", authError);
          
          // If user already exists, try to get the user ID
          const { data: userData, error: userError } = await supabase.auth.signInWithPassword({
            email,
            password: '' // This will fail but might give us user info
          });
          
          if (userError && userError.message.includes("Invalid login credentials")) {
            // User exists but with incorrect password, which is expected
            // Try alternative approach to get user ID
            
            // We'll use list method instead of filter, as filter is not supported
            const { data: userList, error: listUsersError } = await supabase.auth.admin.listUsers();
            
            if (listUsersError) {
              console.error("Error listing users:", listUsersError);
              throw new Error("Could not verify user account");
            }
            
            // Find the user with matching email
            const matchingUser = userList?.users?.find(user => {
              // Safely access the email property
              const userEmail = (user as SupabaseUser).email;
              return userEmail?.toLowerCase() === email.toLowerCase();
            });
            
            if (matchingUser) {
              userId = (matchingUser as SupabaseUser).id;
            }
          }
        } else if (authData && authData.user) {
          userId = authData.user.id;
        }
        
        // If we found or created a user, create/update the profile
        if (userId) {
          try {
            const { error: profileError } = await supabase
              .from('profiles')
              .upsert({
                id: userId,
                name: email.split('@')[0], // Default name from email
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
        } else {
          throw new Error("Could not create or find user account");
        }
        
        // Set authentication in localStorage
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('authMethod', 'email');
        localStorage.setItem('authContact', email);
        
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
