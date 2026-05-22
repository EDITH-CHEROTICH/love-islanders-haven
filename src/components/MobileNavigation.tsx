
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Compass, Heart, Bot, Flame, User, LogOut } from 'lucide-react';
import { useAuth } from '@/context/auth';
import { toast } from 'sonner';

const MobileNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out');
      navigate('/login', { replace: true });
    } catch (err: any) {
      toast.error(err?.message || 'Could not log out');
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-800/90 backdrop-blur-md border-t border-slate-700 py-2 z-50">
      <div className="container mx-auto flex justify-around items-center">
        <Link
          to="/discover"
          className={`flex flex-col items-center p-2 ${isActive('/discover') ? 'text-purple-500' : 'text-gray-400'}`}
        >
          <Compass size={24} />
          <span className="text-xs mt-1">Discover</span>
        </Link>

        <Link
          to="/matches"
          className={`flex flex-col items-center p-2 ${isActive('/matches') ? 'text-purple-500' : 'text-gray-400'}`}
        >
          <Heart size={24} />
          <span className="text-xs mt-1">Matches</span>
        </Link>

        <Link
          to="/ai-companion"
          className={`flex flex-col items-center p-2 ${isActive('/ai-companion') ? 'text-purple-500' : 'text-gray-400'}`}
        >
          <Bot size={24} />
          <span className="text-xs mt-1">Isla</span>
        </Link>

        <Link
          to="/streaks"
          className={`flex flex-col items-center p-2 ${isActive('/streaks') ? 'text-purple-500' : 'text-gray-400'}`}
        >
          <Flame size={24} />
          <span className="text-xs mt-1">Streaks</span>
        </Link>

        <Link
          to="/profile"
          className={`flex flex-col items-center p-2 ${isActive('/profile') ? 'text-purple-500' : 'text-gray-400'}`}
        >
          <User size={24} />
          <span className="text-xs mt-1">Profile</span>
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="flex flex-col items-center p-2 text-gray-400 hover:text-love"
          aria-label="Log out"
        >
          <LogOut size={24} />
          <span className="text-xs mt-1">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default MobileNavigation;
