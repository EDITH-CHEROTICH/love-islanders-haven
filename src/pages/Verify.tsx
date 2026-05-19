
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Verify = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [verificationCode, setVerificationCode] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [contactType, setContactType] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [storedCode, setStoredCode] = useState('');
  
  useEffect(() => {
    // Check if there's contact info in localStorage
    const authMethod = localStorage.getItem('authMethod');
    const authContact = localStorage.getItem('authContact');
    const code = localStorage.getItem('verificationCode');
    
    if (!authMethod || !authContact) {
      // No signup info, redirect back to signup
      navigate('/signup');
      return;
    }
    
    setContactType(authMethod);
    setContactInfo(authContact);
    
    if (code) {
      setStoredCode(code);
    }
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
      if (verificationCode === storedCode) {
        // Get current user if available
        const { data: { user } } = await supabase.auth.getUser();
        
        // Update profile with verified status if user exists
        if (user) {
          try {
            const { error } = await supabase
              .from('profiles')
              .update({
                email_verified: true,
                email: contactInfo
              })
              .eq('id', user.id);
            
            if (error) {
              console.error("Error updating profile:", error);
            }
          } catch (profileError) {
            console.error("Error updating profile:", profileError);
          }
        }
        
        // Mark user as authenticated
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('emailVerificationCompleted', 'true');
        
        toast({
          title: "Verification Successful",
          description: "You're now signed in!",
        });
        
        // Clean up
        localStorage.removeItem('verificationCode');
        
        // Redirect to the discover page
        navigate('/discover', { replace: true });
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
    setIsLoading(true);
    
    try {
      // Generate a new verification code (4 digits)
      const newVerificationCode = Math.floor(1000 + Math.random() * 9000).toString();
      localStorage.setItem('verificationCode', newVerificationCode);
      setStoredCode(newVerificationCode);
      
      // Try to send the verification code via edge function
      try {
        const { error } = await supabase.functions.invoke('send-verification-email', {
          body: { 
            email: contactInfo, 
            code: newVerificationCode 
          }
        });
        
        if (error) {
          console.error("Error sending verification email:", error);
          throw error;
        }
        
        toast({
          title: "New Code Sent",
          description: `We've sent a new verification code to your email.`,
        });
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
        
        // For development, show the code directly
        if (import.meta.env.MODE === 'development') {
          toast({
            title: "New Code Sent (Development)",
            description: `Your new verification code is: ${newVerificationCode}`,
          });
        } else {
          toast({
            title: "Error Sending Code",
            description: "Failed to send verification code. Please try again.",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error("Error generating new code:", error);
      toast({
        title: "Error",
        description: "Failed to generate a new verification code.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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
            disabled={isLoading}
            className="text-muted-foreground hover:text-love text-sm transition-colors"
          >
            {isLoading ? "Processing..." : "Didn't receive a code? Send again"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Verify;
