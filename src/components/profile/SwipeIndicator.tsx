
import React from 'react';
import { Heart, X } from 'lucide-react';

interface SwipeIndicatorProps {
  offsetX: number;
}

const SwipeIndicator = ({ offsetX }: SwipeIndicatorProps) => {
  if (offsetX > 50) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-green-500/70 rounded-full p-4">
          <Heart size={40} className="text-white" />
        </div>
      </div>
    );
  }
  
  if (offsetX < -50) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-rose-500/70 rounded-full p-4">
          <X size={40} className="text-white" />
        </div>
      </div>
    );
  }
  
  return null;
};

export default SwipeIndicator;
