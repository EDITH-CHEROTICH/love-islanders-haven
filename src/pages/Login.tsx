
import { useState } from 'react';
import { useAuth } from '@/context/auth';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Login = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handleSendVerificationCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    try {
      // Generate a 4-digit verification code
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedCode(code);
      
      // Try to send verification code via Supabase edge function
      const { error } = await supabase.functions.invoke('send-verification-email', {
        body: { 
          email, 
          code 
        }
      });
      
      if (error) {
        console.error("Error sending verification email:", error);
        throw error;
      }
      
      // Show verification code input
      setShowCodeInput(true);
      toast.success('Verification code sent to your email');
      
      // Store email in localStorage for persistence
      localStorage.setItem('authContact', email);
    } catch (error: any) {
      console.error("Error:", error);
      
      // For development, show the code in toast for easier testing
      if (process.env.NODE_ENV === 'development') {
        toast.success(`Development: Your code is ${generatedCode}`);
        setShowCodeInput(true);
      } else {
        toast.error('Failed to send verification code. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 4) {
      toast.error('Please enter a valid 4-digit code');
      return;
    }

    setIsLoading(true);

    try {
      if (verificationCode === generatedCode) {
        // Sign up user with empty password (using email verification instead)
        const success = await signUp(email, "");
        
        if (success) {
          // Set auth state in localStorage
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('authMethod', 'email');
          localStorage.setItem('emailVerificationCompleted', 'true');
          
          // Create or update user profile with verified status
          try {
            const { data: { user } } = await supabase.auth.getUser();
            
            if (user) {
              await supabase.from('profiles').upsert(
                { 
                  id: user.id,
                  email: email,
                  email_verified: true,
                  name: email.split('@')[0]
                },
                { onConflict: 'id' }
              );
            }
          } catch (profileError) {
            console.error("Error updating profile:", profileError);
          }
          
          // Redirect to onboarding
          toast.success('Email verified successfully!');
          navigate('/onboarding', { replace: true });
        } else {
          toast.error('Failed to complete signup');
        }
      } else {
        toast.error('Invalid verification code. Please try again.');
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      toast.error(error.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-island-dark via-island to-island-dark p-4">
      <div className="glass-card w-full max-w-md p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gradient mb-8">Sign In / Sign Up</h1>
        
        {!showCodeInput ? (
          <form onSubmit={handleSendVerificationCode} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-white text-lg mb-2">Email</label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="bg-island-light/20 border-island-light text-white h-12"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-love hover:bg-love-dark h-12 text-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </span>
              ) : "Send verification code"}
            </Button>
          </form>
        ) : (
          <div className="space-y-6">
            <p className="text-center text-white mb-4">
              Enter the 4-digit code sent to:
              <span className="block font-medium mt-1">{email}</span>
            </p>
            
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
              placeholder="Enter verification code"
              className="bg-island-light/20 border-island-light text-white text-center text-xl h-12"
            />
            
            <Button 
              onClick={handleVerifyCode}
              className="w-full bg-love hover:bg-love-dark h-12 text-lg"
              disabled={isLoading || verificationCode.length !== 4}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </span>
              ) : "Verify & Continue"}
            </Button>
            
            <div className="text-center">
              <button 
                onClick={() => handleSendVerificationCode({ preventDefault: () => {} } as React.FormEvent)}
                className="text-love hover:underline text-sm"
                type="button"
                disabled={isLoading}
              >
                Didn't receive a code? Send again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
