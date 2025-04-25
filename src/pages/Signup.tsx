
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { authApi } from '@/services/api/auth';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      toast.error('Please enter your name');
      return;
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!password || password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    
    try {
      await authApi.register(email, password, name);
      
      // After successful registration, log the user in
      const loginResponse = await authApi.login(email, password);
      
      // Store the access token
      localStorage.setItem('access_token', loginResponse.access_token);
      localStorage.setItem('user', JSON.stringify(loginResponse.user));
      
      toast.success('Account created successfully!');
      navigate('/onboarding');
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.response?.data?.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-island-dark via-island to-island-dark p-4">
      <div className="glass-card w-full max-w-md p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gradient mb-8">Create Account</h1>
        
        <form onSubmit={handleSignUp} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-white text-lg mb-2">Name</label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="bg-island-light/20 border-island-light text-white h-12"
            />
          </div>

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

          <div>
            <label htmlFor="password" className="block text-white text-lg mb-2">Password</label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
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
                Creating account...
              </span>
            ) : "Sign Up"}
          </Button>

          <div className="text-center">
            <button 
              type="button"
              onClick={handleLogin}
              className="text-love hover:underline text-sm"
            >
              Already have an account? Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
