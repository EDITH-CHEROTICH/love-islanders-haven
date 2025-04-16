
import React from 'react';
import { WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

const OfflinePlaceholder = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-island-dark via-island to-island-dark p-4">
      <div className="glass-card max-w-md p-8 rounded-xl text-center">
        <WifiOff className="h-16 w-16 text-love mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">You're Offline</h1>
        <p className="text-gray-300 mb-6">
          Please check your internet connection and try again.
        </p>
        <Button 
          onClick={() => window.location.reload()} 
          className="bg-love hover:bg-love-dark"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
};

export default OfflinePlaceholder;
