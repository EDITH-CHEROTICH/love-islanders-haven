
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { authApi } from '@/services/api/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!password) {
      toast.error('Please enter your password');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Attempting login with:', { email });
      const response = await authApi.login(email, password);
      console.log('Login response successful:', response);
      
      if (response && response.access_token) {
        // Store the access token and user data
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        toast.success('Successfully logged in!');
        
        // Redirect to discover page immediately
        navigate('/discover', { replace: true });
      } else {
        // Handle case where response is successful but missing token
        console.error("Login response missing token:", response);
        toast.error('Authentication error. Please try again.');
      }
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.message || 'Failed to log in. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-island-dark via-island to-island-dark p-4">
      <div className="glass-card w-full max-w-md p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gradient mb-8">Sign In</h1>
        
        <form onSubmit={handleLogin} className="space-y-6">
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
              placeholder="Enter your password"
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
                Logging in...
              </span>
            ) : "Sign In"}
          </Button>

          <div className="text-center">
            <button 
              type="button"
              onClick={handleSignUp}
              className="text-love hover:underline text-sm"
            >
              Don't have an account? Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
