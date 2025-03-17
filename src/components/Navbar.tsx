
import { Link, useLocation } from 'react-router-dom';
import { Heart, User, MessageCircle, Bot, Settings, Flame } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 w-full h-16 bg-island-light backdrop-blur-lg border-t border-love/10 z-50">
      <div className="container h-full max-w-md mx-auto px-2 flex items-center">
        <SafeAreaSpacer position="bottom">
          <div className="flex justify-around w-full">
            <NavItem path="/" icon={<Heart />} label="Discover" isActive={isActivePath('/')} />
            <NavItem path="/matches" icon={<MessageCircle />} label="Matches" isActive={isActivePath('/matches')} />
            <NavItem path="/streaks" icon={<Flame />} label="Streaks" isActive={isActivePath('/streaks')} />
            <NavItem path="/ai-companion" icon={<Bot />} label="Isla AI" isActive={isActivePath('/ai-companion')} />
            <NavItem path="/profile" icon={<User />} label="Profile" isActive={isActivePath('/profile')} />
            <NavItem path="/settings" icon={<Settings />} label="Settings" isActive={isActivePath('/settings')} />
          </div>
        </SafeAreaSpacer>
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
    className={`flex flex-col items-center justify-center px-1 transition-all duration-300 ${isActive ? 'text-love scale-110' : 'text-muted-foreground'}`}
  >
    <div className={`w-5 h-5 ${isActive ? 'text-love' : ''}`}>
      {icon}
    </div>
    <span className="text-[10px] mt-1">{label}</span>
  </Link>
);

interface SafeAreaSpacerProps {
  children: React.ReactNode;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const SafeAreaSpacer = ({ children, position }: SafeAreaSpacerProps) => {
  const padding = `padding-${position === 'top' || position === 'bottom' ? position : position === 'left' ? 'left' : 'right'}`;
  
  return (
    <div 
      className="w-full flex justify-center items-center" 
      style={{ 
        [`${padding}`]: `env(safe-area-inset-${position}, 0px)` 
      }}
    >
      {children}
    </div>
  );
};

export default Navbar;
