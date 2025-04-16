
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Search, User, MessageCircle, Settings } from 'lucide-react';

const MobileNavigation: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-island-dark border-t border-island-light/30 py-2 px-4 flex justify-around z-50">
      <Link 
        to="/discover" 
        className={`flex flex-col items-center ${isActive('/discover') ? 'text-love' : 'text-white/70'}`}
      >
        <Search size={24} />
        <span className="text-xs mt-1">Discover</span>
      </Link>
      
      <Link 
        to="/matches" 
        className={`flex flex-col items-center ${isActive('/matches') ? 'text-love' : 'text-white/70'}`}
      >
        <Heart size={24} />
        <span className="text-xs mt-1">Matches</span>
      </Link>
      
      <Link 
        to="/messages" 
        className={`flex flex-col items-center ${isActive('/messages') ? 'text-love' : 'text-white/70'}`}
      >
        <MessageCircle size={24} />
        <span className="text-xs mt-1">Messages</span>
      </Link>
      
      <Link 
        to="/profile" 
        className={`flex flex-col items-center ${isActive('/profile') ? 'text-love' : 'text-white/70'}`}
      >
        <User size={24} />
        <span className="text-xs mt-1">Profile</span>
      </Link>
      
      <Link 
        to="/settings" 
        className={`flex flex-col items-center ${isActive('/settings') ? 'text-love' : 'text-white/70'}`}
      >
        <Settings size={24} />
        <span className="text-xs mt-1">Settings</span>
      </Link>
    </div>
  );
};

export default MobileNavigation;
