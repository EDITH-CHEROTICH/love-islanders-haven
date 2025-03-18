
import { useState } from 'react';
import { X } from 'lucide-react';
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogDescription, DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  InputOTP, 
  InputOTPGroup, 
  InputOTPSlot 
} from '@/components/ui/input-otp';
import { toast } from 'sonner';
import { updateVerificationStatus } from '@/services/profiles';

interface VerificationPopupProps {
  open: boolean;
  onClose: () => void;
  onVerified: () => void;
  userId: string;
}

const VerificationPopup = ({ open, onClose, onVerified, userId }: VerificationPopupProps) => {
  const [otp, setOtp] = useState('');
  const [verificationStep, setVerificationStep] = useState<'instructions' | 'otp' | 'selfie'>('instructions');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // In a real app, you would generate and send a real verification code
  // For this demo, we'll use a fixed code
  const verificationCode = '123456';
  
  const handleStartVerification = () => {
    setVerificationStep('otp');
    // In a real implementation, you would trigger sending an OTP code here
    toast.info(`For demo purposes, use the verification code: ${verificationCode}`);
  };
  
  const handleVerifyCode = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter a complete 6-digit verification code');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate verification delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (otp === verificationCode) {
        // Use our verification service instead of direct Supabase calls
        const { error } = await updateVerificationStatus(userId, true);
          
        if (error) throw error;
        
        toast.success('Verification successful!');
        onVerified();
        onClose();
      } else {
        toast.error('Invalid verification code. Please try again.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('An error occurred during verification');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="bg-island-dark border-island-light text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Verify Your Profile</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Verification helps build trust in the community.
          </DialogDescription>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-white"
          >
            <X size={18} />
          </button>
        </DialogHeader>
        
        {verificationStep === 'instructions' && (
          <div className="space-y-4 py-2">
            <p>To verify your profile, we'll send a one-time code to your email address.</p>
            <p className="text-sm text-muted-foreground">
              This helps us confirm your identity and shows other users that you're a real person.
            </p>
            <DialogFooter className="pt-4">
              <Button onClick={handleStartVerification} className="w-full bg-love hover:bg-love-dark">
                Start Verification
              </Button>
            </DialogFooter>
          </div>
        )}
        
        {verificationStep === 'otp' && (
          <div className="space-y-6 py-2">
            <p className="text-center">Enter the 6-digit verification code sent to your email</p>
            
            <div className="flex justify-center py-4">
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            
            <DialogFooter>
              <Button 
                onClick={handleVerifyCode} 
                disabled={otp.length !== 6 || isSubmitting}
                className="w-full bg-love hover:bg-love-dark"
              >
                {isSubmitting ? 'Verifying...' : 'Verify Code'}
              </Button>
            </DialogFooter>
            
            <div className="text-center text-sm text-muted-foreground">
              <button className="text-love hover:underline">
                Didn't receive a code? Send again
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VerificationPopup;
