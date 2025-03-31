
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";

const Verify = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [verificationCode, setVerificationCode] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [contactType, setContactType] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Check if there's contact info in localStorage
    const authMethod = localStorage.getItem('authMethod');
    const authContact = localStorage.getItem('authContact');
    
    if (!authMethod || !authContact) {
      // No signup info, redirect back to signup
      navigate('/signup');
      return;
    }
    
    setContactType(authMethod);
    setContactInfo(authContact);
  }, [navigate]);
  
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (verificationCode.length !== 4) {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid 4-digit verification code.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check verification code
      const storedCode = localStorage.getItem('verificationCode');
      
      if (verificationCode === storedCode) {
        // Mark user as authenticated
        localStorage.setItem('isAuthenticated', 'true');
        
        toast({
          title: "Verification Successful",
          description: "You're now signed in!",
        });
        
        // Clean up
        localStorage.removeItem('verificationCode');
        
        // Redirect to the discover page instead of main page
        navigate('/discover');
      } else {
        // Decrease attempts
        const newAttemptsLeft = attemptsLeft - 1;
        setAttemptsLeft(newAttemptsLeft);
        
        if (newAttemptsLeft <= 0) {
          toast({
            title: "Too Many Attempts",
            description: "Please try signing up again.",
            variant: "destructive"
          });
          navigate('/signup');
        } else {
          toast({
            title: "Incorrect Code",
            description: `Incorrect verification code. ${newAttemptsLeft} attempts left.`,
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "An error occurred during verification.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResendCode = async () => {
    // Generate a new verification code (4 digits)
    const newVerificationCode = Math.floor(1000 + Math.random() * 9000).toString();
    localStorage.setItem('verificationCode', newVerificationCode);
    
    toast({
      title: "New Code Sent",
      description: `Your new verification code is: ${newVerificationCode}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-island-dark via-island to-island-dark pt-4 pb-20 flex flex-col items-center justify-center px-4">
      <div className="glass-card w-full max-w-md p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-gradient text-center mb-2">Verify Your Account</h1>
        
        <p className="text-center text-muted-foreground mb-6">
          Enter the 4-digit code sent to your {contactType === 'email' ? 'email' : 'phone'}:
          <span className="block font-medium mt-1">{contactInfo}</span>
        </p>
        
        <form onSubmit={handleVerify} className="space-y-6">
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
          
          <Button 
            type="submit" 
            className="w-full bg-love hover:bg-love-dark"
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify Code"}
          </Button>
        </form>
        
        <div className="mt-4 text-center">
          <button 
            onClick={handleResendCode}
            className="text-muted-foreground hover:text-love text-sm transition-colors"
          >
            Didn't receive a code? Send again
          </button>
        </div>
      </div>
    </div>
  );
};

export default Verify;
