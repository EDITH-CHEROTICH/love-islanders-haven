
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, User, MessageCircle, Bot } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const [isActive, setIsActive] = useState(false);
  
  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 w-full h-16 bg-island-light backdrop-blur-lg border-t border-love/10 z-50 animate-fade-in">
      <div className="container h-full max-w-md mx-auto px-4 flex justify-around items-center">
        <Link 
          to="/" 
          className={`flex flex-col items-center justify-center transition-all duration-300 ${isActivePath('/') ? 'text-love scale-110' : 'text-muted-foreground'}`}
        >
          <Heart className={`w-6 h-6 ${isActivePath('/') ? 'fill-love' : ''}`} />
          <span className="text-xs mt-1">Discover</span>
        </Link>
        
        <Link 
          to="/matches" 
          className={`flex flex-col items-center justify-center transition-all duration-300 ${isActivePath('/matches') ? 'text-love scale-110' : 'text-muted-foreground'}`}
        >
          <MessageCircle className="w-6 h-6" />
          <span className="text-xs mt-1">Matches</span>
        </Link>
        
        <Link 
          to="/ai-companion" 
          className={`flex flex-col items-center justify-center transition-all duration-300 ${isActivePath('/ai-companion') ? 'text-love scale-110' : 'text-muted-foreground'}`}
        >
          <Bot className="w-6 h-6" />
          <span className="text-xs mt-1">Isla AI</span>
        </Link>
        
        <Link 
          to="/profile" 
          className={`flex flex-col items-center justify-center transition-all duration-300 ${isActivePath('/profile') ? 'text-love scale-110' : 'text-muted-foreground'}`}
        >
          <User className="w-6 h-6" />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
