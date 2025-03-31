
import { useState } from 'react';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogDescription 
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import EmailAuthForm from './EmailAuthForm';
import VerificationForm from './VerificationForm';

interface EmailVerificationPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmailVerificationPopup = ({ isOpen, onClose }: EmailVerificationPopupProps) => {
  const [email, setEmail] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);

  const handleEmailSubmit = (email: string, code: string) => {
    setEmail(email);
    setGeneratedCode(code);
    setIsEmailSubmitted(true);
  };

  const handleResendCode = async () => {
    setIsSendingCode(true);
    
    try {
      // Generate a new 4-digit code
      const newCode = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedCode(newCode);
      
      // Send verification code via email through Supabase function
      const { error } = await supabase.functions.invoke('send-verification-email', {
        body: { 
          email, 
          code: newCode 
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast.success("Verification code resent");
    } catch (error: any) {
      console.error("Error resending verification code:", error);
      toast.error("Failed to resend verification code");
    } finally {
      setIsSendingCode(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setGeneratedCode("");
    setIsEmailSubmitted(false);
    setIsSendingCode(false);
  };

  const handleDialogClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleDialogClose()}>
      <DialogContent className="bg-island-dark border-island-light text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">
            {isEmailSubmitted ? "Verify Your Email" : "Welcome to Love Islanders"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isEmailSubmitted 
              ? "Enter the verification code sent to your email"
              : "Please verify your email to continue"
            }
          </DialogDescription>
          <button 
            onClick={handleDialogClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-white"
          >
            <X size={18} />
          </button>
        </DialogHeader>
        
        {isEmailSubmitted ? (
          <VerificationForm 
            email={email}
            generatedCode={generatedCode}
            onResendCode={handleResendCode}
            isSendingCode={isSendingCode}
            onClose={handleDialogClose}
          />
        ) : (
          <EmailAuthForm onEmailSubmit={handleEmailSubmit} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EmailVerificationPopup;
