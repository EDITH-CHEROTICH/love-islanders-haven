
import { useState, useEffect } from "react";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import VerificationDialog from "./VerificationDialog";
import { useNavigate } from "react-router-dom";

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
  const { toast } = useToast();
  const navigate = useNavigate();

  const sendVerificationEmail = async (email: string, code: string) => {
    setSendingEmail(true);
    try {
      const { error } = await supabase.functions.invoke('send-verification-email', {
        body: { email, code }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast({
        title: "Verification code sent",
        description: `We've sent a verification code to ${email}. Please check your inbox.`,
      });
    } catch (error: any) {
      console.error("Error sending verification email:", error);
      toast({
        title: "Error sending email",
        description: "We couldn't send the verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSendingEmail(false);
    }
  };

  const completeSignUp = async () => {
    try {
      console.log("EmailVerificationHandler: Starting completeSignUp");
      const success = await onCompleteSignUp();
      console.log("EmailVerificationHandler: onCompleteSignUp result:", success);
      
      if (success) {
        // Ensure we have a profile for this user
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            console.log("EmailVerificationHandler: Creating/updating profile for user:", user.id);
            // Try to upsert the profile
            const { error } = await supabase
              .from('profiles')
              .upsert({
                id: user.id,
                name: email.split('@')[0], // Default name from email
                email: email
              }, {
                onConflict: 'id'
              });
              
            if (error) {
              console.error("Error creating profile:", error);
            } else {
              console.log("Profile created/updated for new user");
            }
          }
        } catch (profileError) {
          console.error("Error creating profile during signup:", profileError);
        }
        
        setShowVerification(false);
        
        console.log("EmailVerificationHandler: Navigating to discover page after verification");
        
        // Set auth state in localStorage first
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('authMethod', 'email');
        localStorage.setItem('authContact', email);
        
        // Use navigate with replace and delay to ensure state updates complete
        setTimeout(() => {
          console.log("EmailVerificationHandler: Executing delayed navigation to /discover");
          navigate('/discover', { replace: true });
        }, 300);
        
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
    if (email && generatedCode) {
      sendVerificationEmail(email, generatedCode);
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
