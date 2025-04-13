
import { useState, useEffect } from "react";
import { Dialog } from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import VerificationDialog from "./VerificationDialog";
import { useNavigate } from "react-router-dom";
import { setupUserProfileAfterVerification } from "@/services/profiles/profile-creation";

interface EmailVerificationHandlerProps {
  email: string;
  generatedCode: string;
  onCompleteSignUp: () => Promise<boolean>;
}

const EmailVerificationHandler = ({
  email,
  generatedCode,
  onCompleteSignUp
}: EmailVerificationHandlerProps) => {
  const [showVerification, setShowVerification] = useState(true);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [currentCode, setCurrentCode] = useState(generatedCode);
  const navigate = useNavigate();

  const completeSignUp = async () => {
    try {
      console.log("EmailVerificationHandler: Starting completeSignUp");
      const success = await onCompleteSignUp();
      console.log("EmailVerificationHandler: onCompleteSignUp result:", success);
      
      if (success) {
        // Ensure we have a profile for this user with verified email status
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            console.log("EmailVerificationHandler: Creating/updating profile for user:", user.id);
            
            // Setup user profile after verification
            await setupUserProfileAfterVerification(user.id, email);
          }
        } catch (profileError) {
          console.error("Error creating profile during signup:", profileError);
        }
        
        setShowVerification(false);
        
        console.log("EmailVerificationHandler: Navigating to profile page after verification");
        
        // Set auth state in localStorage first
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('authMethod', 'email');
        localStorage.setItem('authContact', email);
        localStorage.setItem('emailVerificationCompleted', 'true');
        
        // Navigate to profile page to set up user profile
        navigate('/profile', { replace: true });
        
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("Error in completeSignUp:", error);
      throw error;
    }
  };

  // Send the verification email when this component mounts
  useEffect(() => {
    const sendVerificationEmail = async () => {
      setSendingEmail(true);
      try {
        console.log("Sending verification email to:", email, "with code:", generatedCode);
        const { error } = await supabase.functions.invoke('send-verification-email', {
          body: { email, code: generatedCode }
        });
        
        if (error) {
          console.error("Error sending verification email:", error);
          throw new Error(error.message);
        }
        
        toast.success(`Verification code sent to ${email}`);
      } catch (error: any) {
        console.error("Error sending verification email:", error);
        toast.error("Failed to send verification code. Please try again.");
      } finally {
        setSendingEmail(false);
      }
    };

    if (email && generatedCode) {
      sendVerificationEmail();
    }
  }, [email, generatedCode]);

  return (
    <Dialog open={showVerification} onOpenChange={setShowVerification}>
      <VerificationDialog 
        email={email}
        generatedCode={currentCode}
        setGeneratedCode={setCurrentCode}
        onVerifySuccess={completeSignUp}
        sendingEmail={sendingEmail}
        setSendingEmail={setSendingEmail}
      />
    </Dialog>
  );
};

export default EmailVerificationHandler;
