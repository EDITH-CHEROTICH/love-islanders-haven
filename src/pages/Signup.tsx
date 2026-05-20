import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name) return toast.error('Please enter your name');
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) return toast.error('Please enter a valid email');
    if (!password || password.length < 8) return toast.error('Password must be 8+ characters');

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: { name },
        },
      });

      if (error) {
        toast.error(error.message || 'Failed to create account.');
        return;
      }

      if (data.user) {
        // Create profile + onboarding rows (ignore conflicts in case trigger already created them)
        await supabase.from('profiles').upsert(
          { id: data.user.id, email, name, email_verified: !!data.session },
          { onConflict: 'id' }
        );
        await supabase.from('profile_onboarding').upsert(
          { profile_id: data.user.id, completed: false, current_step: 'basics' },
          { onConflict: 'profile_id' }
        );

        if (data.session) {
          localStorage.setItem('isAuthenticated', 'true');
          toast.success('Account created! Let\'s set up your profile.');
          navigate('/onboarding', { replace: true });
        } else {
          toast.success('Check your email to verify your account.');
          navigate('/login', { replace: true });
        }
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-island-dark via-island to-island-dark p-4">
      <div className="glass-card w-full max-w-md p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gradient mb-8">Create Account</h1>

        <form onSubmit={handleSignUp} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-white text-lg mb-2">Name</label>
            <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name" className="bg-island-light/20 border-island-light text-white h-12" />
          </div>
          <div>
            <label htmlFor="email" className="block text-white text-lg mb-2">Email</label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com" className="bg-island-light/20 border-island-light text-white h-12" />
          </div>
          <div>
            <label htmlFor="password" className="block text-white text-lg mb-2">Password</label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters" className="bg-island-light/20 border-island-light text-white h-12" />
          </div>

          <Button type="submit" className="w-full bg-love hover:bg-love-dark h-12 text-lg" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </span>
            ) : 'Sign Up'}
          </Button>

          <div className="text-center">
            <button type="button" onClick={() => navigate('/login')}
              className="text-love hover:underline text-sm">
              Already have an account? Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
