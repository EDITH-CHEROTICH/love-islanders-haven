
import { Link, useLocation } from 'react-router-dom';
import { Compass, Heart, Bot, Flame, User } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Hide navbar on verify page
  if (location.pathname === '/verify') {
    return null;
  }
  
  const isActivePath = (path: string) => {
    return location.pathname === path || 
           (path === '/discover' && location.pathname === '/');
  };

  return (
    <nav className="fixed bottom-0 left-0 w-full h-16 bg-slate-800/90 backdrop-blur-lg border-t border-slate-700 z-50">
      <div className="container h-full max-w-md mx-auto px-2 flex items-center">
        <div className="flex justify-between w-full">
          <NavItem path="/discover" icon={<Compass size={18} />} label="Discover" isActive={isActivePath('/discover')} />
          <NavItem path="/matches" icon={<Heart size={18} />} label="Matches" isActive={isActivePath('/matches')} />
          <NavItem path="/ai-companion" icon={<Bot size={18} />} label="Isla" isActive={isActivePath('/ai-companion')} />
          <NavItem path="/streaks" icon={<Flame size={18} />} label="Streaks" isActive={isActivePath('/streaks')} />
          <NavItem path="/profile" icon={<User size={18} />} label="Profile" isActive={isActivePath('/profile')} />
        </div>
      </div>
    </nav>
  );
};

interface NavItemProps {
  path: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavItem = ({ path, icon, label, isActive }: NavItemProps) => (
  <Link 
    to={path} 
    className={`flex flex-col items-center justify-center px-2 transition-all duration-300 ${isActive ? 'text-purple-500 scale-110' : 'text-gray-400'}`}
  >
    <div className={`${isActive ? 'text-purple-500' : ''}`}>
      {icon}
    </div>
    <span className="text-[10px] mt-1">{label}</span>
  </Link>
);

export default Navbar;
