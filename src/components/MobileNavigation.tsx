
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, Settings, Heart } from 'lucide-react';

const MobileNavigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-island-dark/80 backdrop-blur-md border-t border-island-light py-2 z-50">
      <div className="container mx-auto flex justify-around items-center">
        <Link 
          to="/discover" 
          className={`flex flex-col items-center p-2 ${isActive('/discover') ? 'text-love' : 'text-muted-foreground'}`}
        >
          <Home size={24} />
          <span className="text-xs mt-1">Discover</span>
        </Link>
        
        <Link 
          to="/matches" 
          className={`flex flex-col items-center p-2 ${isActive('/matches') ? 'text-love' : 'text-muted-foreground'}`}
        >
          <Heart size={24} />
          <span className="text-xs mt-1">Matches</span>
        </Link>
        
        <Link 
          to="/profile" 
          className={`flex flex-col items-center p-2 ${isActive('/profile') ? 'text-love' : 'text-muted-foreground'}`}
        >
          <User size={24} />
          <span className="text-xs mt-1">Profile</span>
        </Link>
        
        <Link 
          to="/settings" 
          className={`flex flex-col items-center p-2 ${isActive('/settings') ? 'text-love' : 'text-muted-foreground'}`}
        >
          <Settings size={24} />
          <span className="text-xs mt-1">Settings</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileNavigation;
