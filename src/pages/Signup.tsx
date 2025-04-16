
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-island-dark via-island to-island-dark p-4">
      <div className="glass-card w-full max-w-md p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-gradient text-center mb-6">Create Account</h1>
        <p className="text-center text-muted-foreground mb-6">
          Join our community and start your dating journey
        </p>
        <Button 
          className="w-full bg-love hover:bg-love-dark mb-4"
          onClick={() => navigate('/login')}
        >
          Return to Login Page
        </Button>
      </div>
    </div>
  );
};

export default Signup;
