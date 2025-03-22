
import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import VerificationDialog from "./VerificationDialog";

interface EmailVerificationHandlerProps {
  email: string;
  password: string;
  generatedCode: string;
  onCompleteSignUp: (email: string, password: string) => Promise<boolean>;
}

const EmailVerificationHandler = ({
  email,
  password,
  generatedCode,
  onCompleteSignUp
}: EmailVerificationHandlerProps) => {
  const [showVerification, setShowVerification] = useState(true);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [currentCode, setCurrentCode] = useState(generatedCode);
  const { toast } = useToast();

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
      const success = await onCompleteSignUp(email, password);
      if (success) {
        setShowVerification(false);
        return true;
      }
      return false;
    } catch (error: any) {
      throw error;
    }
  };

  // Send the verification email when this component mounts
  useState(() => {
    if (email && generatedCode) {
      sendVerificationEmail(email, generatedCode);
    }
  });

  return (
    <Dialog open={showVerification} onOpenChange={setShowVerification}>
      <VerificationDialog 
        email={email}
        generatedCode={currentCode}
        setGeneratedCode={setCurrentCode}
        onVerifySuccess={completeSignUp}
        password={password}
        sendingEmail={sendingEmail}
        setSendingEmail={setSendingEmail}
      />
    </Dialog>
  );
};

export default EmailVerificationHandler;
