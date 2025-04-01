
import React from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface SwipeButtonProps {
  onClick?: () => void;
  icon: LucideIcon;
  color: string;
  size?: 'sm' | 'md' | 'lg';
  ariaLabel: string;
}

const SwipeButton = ({ 
  onClick, 
  icon: Icon, 
  color, 
  size = 'md', 
  ariaLabel 
}: SwipeButtonProps) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-14 h-14',
    lg: 'w-16 h-16'
  };

  return (
    <button 
      onClick={onClick} 
      className={`${sizeClasses[size]} bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center border border-${color}/20 shadow-lg transition-all`}
      aria-label={ariaLabel}
    >
      <Icon className={`text-${color} w-7 h-7`} />
    </button>
  );
};

export default SwipeButton;
