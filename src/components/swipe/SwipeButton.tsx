
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

  // Map color string to actual Tailwind classes
  const getColorClass = (colorName: string) => {
    const colorMap: Record<string, string> = {
      'rose-500': 'text-rose-500 border-rose-500/20',
      'green-500': 'text-green-500 border-green-500/20',
      'blue-500': 'text-blue-500 border-blue-500/20',
      'yellow-500': 'text-yellow-500 border-yellow-500/20',
      'purple-500': 'text-purple-500 border-purple-500/20'
    };
    
    return colorMap[colorName] || `text-${colorName} border-${color}/20`;
  };

  const colorClass = getColorClass(color);
  const [textColorClass, borderColorClass] = colorClass.split(' ');

  return (
    <button 
      onClick={onClick} 
      className={`${sizeClasses[size]} bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center ${borderColorClass} shadow-lg transition-all`}
      aria-label={ariaLabel}
    >
      <Icon className={`${textColorClass} w-7 h-7`} />
    </button>
  );
};

export default SwipeButton;
